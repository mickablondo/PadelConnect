// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IPadelConnect.sol";
import "./PadelConnectNFT.sol";

// TODO revoir visibilité
// TODO nom prénom utiles ??? (surtout pour le manager)

/// @title Padel tournament management contract
/// @notice This contract makes it possible to manage padel tournaments and to connect the different users.
/// @dev The owner adds tournament managers.
///      The tournament managers create tournaments.
///      The players register for tournaments. 
/// @author Mickaël Blondeau
contract PadelConnect is IPadelConnect, Ownable, PadelConnectNFT {

    /// @notice Map of a manager address to his description
    mapping(address => Manager) managers;

    /// @notice Map of a tournament id to a manager address
    mapping(uint => address) linkManagerTournament;

    /// @notice Array of the tournaments
    Tournament[] public tournaments;

    /// @notice Map of a player address to his description
    mapping(address => Player) players;

    /// @notice Map of a tournament id to the addresses of his followers
    mapping(uint => mapping(address => bool)) public followedTournaments;

    /// @notice Map of a tournamentId to the comments
    mapping(uint => mapping(uint => Comment)) public comments;

    /// @notice Map of a tournamentId to the max commentId
    /// @dev Use it to know the number of comments by tournament
    mapping(uint => uint) idComments;

    /// @notice Map of a tournament to a map of a player address to the private comments
    mapping(uint => mapping(address => Comment[])) privateComments; // TODO à revérifier

    /// @notice Map of an address to a timestamp
    mapping(address => uint) lastPostDate;

    /// @notice Custom error when payment failed.
    error ErrorDuringPayment();

    /// @notice Custom error when the tournament is complete.
    error CompleteTournament();

    /// @notice Custom error when the registration phase is finished
    error RegistrationEnded();

    /**
     * @dev Sender must be a manager registered
     */
    modifier onlyManagers() {
        require(managers[msg.sender].isRegistered, "Forbidden");
        _;
    }

    /**
     * @dev The id sent must exist.
     * @param _tournamentId id of the tournament
     */
    modifier shouldIdTournamentExists(uint _tournamentId) {
        require(_tournamentId < tournaments.length, "Wrong id sent");
        _;
    }

    /**
     * @dev The address must be not the zero address
     * @param _address the address to check
     */
    modifier notZeroAddress(address _address) {
         require(_address != address(0), "Cannot be the zero address");
         _;
    }

    /**
     * @dev The string must not be empty
     * @param _field the string to be checked
     */
    modifier notEmptyString(string memory _field) {
         require(bytes(_field).length > 0, "Cannot be empty");
         _;
    }

    /**
     * @dev Check the time between two comments
     * @param _address the address of the author
     */
    modifier waitUntilNewPost(address _address) {
        require(lastPostDate[msg.sender] < block.timestamp - 10, "Wait 10s");
        _;
    }

    /**
     * @dev See {IPadelConnect-addManager}.
     */
    function addManager(address _address, string calldata _firstName, string calldata _lastName) external onlyOwner notZeroAddress(_address) notEmptyString(_firstName) notEmptyString(_lastName) {
        require(!managers[_address].isRegistered, "Already registered");

        managers[_address].lastName = _lastName;
        managers[_address].firstName = _firstName;
        managers[_address].isRegistered = true;

        emit ManagerAdded(_address);
    }

    /**
     * @dev See {IPadelConnect-addTournament}.
     */
    function addTournament(string calldata _city, uint _date, uint8 _diff,uint8 _maxPlayers) external onlyManagers notEmptyString(_city) {
        require(_date > block.timestamp, "Incorrect date");
        require(_maxPlayers > 0 && _maxPlayers % 2 == 0, "Played by 2");

        uint id = tournaments.length;
        address temp;

        tournaments.push(
            Tournament(
                id,
                _city,
                _date,
                getDifficultyFromUint(_diff),
                _maxPlayers,
                _maxPlayers, // nombre de places disponibles = nombre de joueurs autorisés à la création du tournoi
                temp,
                temp
            )
        );

        linkManagerTournament[id] = msg.sender;
        emit TournamentCreated(_city, _date);
    }

    /**
     * @dev See {IPadelConnect-registerPlayer}.
     */
    function registerPlayer(uint _id, string calldata _firstName, string calldata _lastName) external shouldIdTournamentExists(_id) notEmptyString(_firstName) notEmptyString(_lastName) {
        Tournament memory tournament = tournaments[_id];

        if(tournament.date < block.timestamp) {
            revert RegistrationEnded();
        }

        if(tournament.registrationsAvailable == 0) {
            revert CompleteTournament();
        }

        players[msg.sender] = Player(_lastName, _firstName);

        --tournament.registrationsAvailable;
        tournaments[_id].registrationsAvailable = tournament.registrationsAvailable;
    }

    /**
     * @dev See {IPadelConnect-addWinners}.
     */
    function addWinners(uint _id, address _winner1, address _winner2) external onlyOwner shouldIdTournamentExists(_id) notZeroAddress(_winner1) notZeroAddress(_winner2) {
        require(_winner1 != _winner2, "Same address");

        tournaments[_id].winner1 = _winner1;
        tournaments[_id].winner2 = _winner2;

        string memory city = tournaments[_id].city;

        Player memory tempPlayer = players[_winner1];
        MintReward(_winner1, _id, city, tempPlayer.firstName, tempPlayer.lastName);

        tempPlayer = players[_winner2];
        MintReward(_winner2, _id, city, tempPlayer.firstName, tempPlayer.lastName);
    }

    /**
     * @dev See {IPadelConnect-addComment}.
     */
    function addComment(uint _id, string calldata _message) external shouldIdTournamentExists(_id) notEmptyString(_message) waitUntilNewPost(msg.sender) {
        comments[_id][idComments[_id]] = Comment(_message, msg.sender);
        ++idComments[_id];
        lastPostDate[msg.sender] = block.timestamp;

        emit TournamentCommentAdded(_id);
    }

    /**
     * @dev See {IPadelConnect-shouldIdTournamentExists}.
     */
    function followTournament(uint _id) external shouldIdTournamentExists(_id) {
        followedTournaments[_id][msg.sender] = true;
    }

    /**
     * @dev See {IPadelConnect-addPrivateCommentToManager}.
     */
    function addPrivateCommentToManager(uint _id, string calldata _message) external shouldIdTournamentExists(_id) notEmptyString(_message) waitUntilNewPost(msg.sender) {
        privateComments[_id][msg.sender].push(Comment(_message, msg.sender));

        lastPostDate[msg.sender] = block.timestamp;
        emit PrivateCommentAdded(_id, msg.sender);
    }

    /**
     * @dev See {IPadelConnect-addPrivateResponseToPlayer}.
     */
    function addPrivateResponseToPlayer(uint _id, address _player, string calldata _message) external onlyManagers() shouldIdTournamentExists(_id) notZeroAddress(_player) notEmptyString(_message) waitUntilNewPost(msg.sender) {
        privateComments[_id][_player].push(Comment(_message, msg.sender));

        lastPostDate[msg.sender] = block.timestamp;
        emit PrivateResponseAdded(_id, _player);
    }

    /// @notice Returns the difficulty value from the enum
    /// @param _difficulty the difficulty in uint
    /// @return the difficulty from the enum
    function getDifficultyFromUint(uint _difficulty) private pure returns(Difficulty) {
        if(_difficulty == 0) return Difficulty.p25; 
        if(_difficulty == 1) return Difficulty.p100;
        if(_difficulty == 2) return Difficulty.p250;
        if(_difficulty == 3) return Difficulty.p500;
        if(_difficulty == 4) return Difficulty.p1000;
        if(_difficulty == 5) return Difficulty.p2000;
        return Difficulty.UNKNOWN;
    }
}
