// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IPadelConnect.sol";
import "./PadelConnectNFT.sol";

// TODO revoir visibilité

/// @title Padel tournament management contract
/// @notice This contract makes it possible to manage padel tournaments and to connect the different users.
/// @dev The owner adds tournament managers.
///      The tournament managers create tournaments.
///      The players register for tournaments. 
/// @author Mickaël Blondeau
contract PadelConnect is IPadelConnect, Ownable, PadelConnectNFT {

    /// @notice Map of a manager address to his description
    mapping(address => Manager) private managers;

    /// @notice Map of a tournament id to a manager address
    mapping(uint => address) linkManagerTournament;

    /// @notice Array of the tournaments
    Tournament[] public tournaments;

    /// @notice Map of a player address to his description
    mapping(address => Player) private players;

    /// @notice Map of a player address to his following tournaments
    mapping(address => Tournament) followingTournamentsByPlayers;

    /// @notice Map of a tournamentId to the comments
    mapping(uint => Comment[]) comments;

    /// @notice Map of a tournament to a map of a player address to the private comments
    mapping(uint => mapping(address => Comment[])) private privateComments;

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
        require(managers[msg.sender].isRegistered, "Forbidden access, you're not a manager !");
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
     * @dev See {IPadelConnect-addManager}.
     */
    function addManager(address _address, string calldata _firstName, string calldata _lastName) external onlyOwner notZeroAddress(_address) {
        require(!managers[_address].isRegistered, "Already registered");
        require(bytes(_firstName).length > 0, "First name cannot be empty");
        require(bytes(_lastName).length > 0, "First name cannot be empty");

        managers[_address].lastName = _lastName;
        managers[_address].firstName = _firstName;
        managers[_address].isRegistered = true;

        emit ManagerAdded(_address);
    }

    /**
     * @dev See {IPadelConnect-addTournament}.
     */
    function addTournament(string calldata _city, uint _price, uint _date, uint8 _maxPlayers) external onlyManagers {
        require(bytes(_city).length > 0, "City cannot be empty");
        require(_price > 0, "Mandatory price");
        require(_date > block.timestamp, "Date must be in the future");
        require(_maxPlayers > 0 && _maxPlayers % 2 == 0, "Padel is played by 2");

        uint id = tournaments.length;
        address[2] memory temp;

        tournaments.push(
            Tournament(
                id,
                _city,
                _price,
                _date,
                _maxPlayers,
                _maxPlayers, // nombre de places disponibles = nombre de joueurs autorisés à la création du tournoi
                temp
            )
        );

        linkManagerTournament[id] = msg.sender;

        emit TournamentCreated(_city, _price, _date, temp);
    }

    /**
     * @dev See {IPadelConnect-getTournament}.
     */
    function getTournament(uint _id) external view shouldIdTournamentExists(_id) returns(Tournament memory) {
        return tournaments[_id]; // TODO : utile car public ???
    }

    /**
     * @dev See {IPadelConnect-registerPlayer}.
     */
    function registerPlayer(uint _id, string calldata _firstName, string calldata _lastName) payable external shouldIdTournamentExists(_id) {
        require(bytes(_firstName).length > 0, "Cannot be empty");
        require(bytes(_lastName).length > 0, "Cannot be empty");

        Tournament memory tournament = tournaments[_id];

        if(tournament.date < block.timestamp) {
            revert RegistrationEnded();
        }

        if(tournament.registrationsAvailable == 0) {
            revert CompleteTournament();
        }

        // TODO tournament.price vs msg.value
        // TODO Reentrancy Guard from OZ ?
        (bool sent, ) = address(linkManagerTournament[_id]).call{value: msg.value}("");
        if(!sent) {
            revert ErrorDuringPayment();
        }

        players[msg.sender] = Player(_lastName, _firstName);
 
        // TODO : tester différentes façons et vérifier quelle est la moins coûteuse
        --tournament.registrationsAvailable;
        tournaments[_id].registrationsAvailable = tournament.registrationsAvailable;
    }

    /**
     * @dev See {IPadelConnect-addWinners}.
     */
    function addWinners(uint _id, address _winner1, address _winner2) external onlyOwner shouldIdTournamentExists(_id) notZeroAddress(_winner1) notZeroAddress(_winner2) {
        // TODO ENUM finish ???
        address[2] memory temp;
        temp[0] = _winner1;
        temp[1] = _winner2;
        tournaments[_id].winners = temp;

        string memory city = tournaments[_id].city;

        Player memory tempPlayer = players[_winner1];
        MintReward(_winner1, _id, city, tempPlayer.firstName, tempPlayer.lastName);

        tempPlayer = players[_winner2];
        MintReward(_winner2, _id, city, tempPlayer.firstName, tempPlayer.lastName);
    }

    /**
     * @dev See {IPadelConnect-addComment}.
     */
    function addComment(uint _id, address _author, string calldata _message) external shouldIdTournamentExists(_id) notZeroAddress(_author) {
        // require(timestampLastPost[msg.sender] < block.timestamp - 30, "You need to wait 30 secondes between each posts");
        // mapping(address => uint) public timestampLastPost;
    }

    /**
     * @dev See {IPadelConnect-addPrivateComment}.
     */
    function addPrivateComment(uint _id, address _author, string calldata _message) external shouldIdTournamentExists(_id) notZeroAddress(_author) {

    }
}