// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title Padel tournament management contract
/// @notice This interface shows how to interact with the Smart Contract.
/// @author Mickaël Blondeau
interface IPadelConnect {

    /// @notice Description of a tournament
    struct Tournament {
        uint id;
        bytes32 city;
        uint price;
        uint date;
        uint8 maxPlayers;
        address[2] winners;
    }

    /// @notice Description of a manager
    struct Manager {
        bytes32 lastName;
        bytes32 firstName;
        bool isRegistered;
    }

    /// @notice Description of a player
    struct Player {
        bytes32 lastName;
        bytes32 firstName;
    }

    /// @notice Description of a Comment
    struct Comment {
        string message;
        address author;
    }

    /**
     * @dev Emitted when owner adds a new manager.
     */
    event ManagerAdded(uint tournamentId);

    /**
     * @dev Emitted when manager adds a new tournament.
     */
    event TournamentCreated(bytes32 city, uint price, uint date, address[2] winners);

    /**
     * @dev Emitted when somebody adds a new comment on a tournament forum.
     */
    event TournamentCommentAdded(uint tournamentId);

    /**
     * @dev Emitted when player adds a comment to a manager or vice versa.
     */
    event PrivateCommentAdded(uint tournamentId, address player);

    /**
     * @dev Add a new tournament manager with his informations.
     *
     * Requirements:
     * - `msg.sender` can only be the owner
     * - `_address` cannont be the zero address
     * - `_address` cannot be ever registering
     * - `_firstName` cannot be empty
     * - `_lastName` cannot be empty
     *
     * Emits a {ManagerAdded} event.
     *
     * @param _address address of the new manager 
     * @param _firstName first name of the new manager 
     * @param _lastName last name of the new manager 
     */
    function addManager(address _address, bytes32 _firstName, bytes32 _lastName) external;

    /**
     * @dev Add a new tournament.
     *
     * Requirements:
     * - `msg.sender` can only be a manager
     * - `_city` cannont be empty
     * - `_price` must be greater than 0
     * - `_date` must be in the future
     * - `_maxPlayers` must be a multiple of two and greater than 0
     *
     * Emits a {TournamentCreated} event.
     *
     * @param _city city name of the new tournament 
     * @param _price price to register at the tournament 
     * @param _date date of the new tournament
     * @param _maxPlayers maximum number of players
     */
    function addTournament( bytes32 _city, uint _price, uint _date, uint8 _maxPlayers) external;

    /**
     * @dev Add a new tournament.
     *
     * Requirements:
     * - `_id` must be greater than 0 and less than the length of the array
     * 
     * @param _id id of the tournament
     */
    function getTournament(uint _id) external view returns(Tournament memory);

    /**
     * @dev Register a player to a tournament and pay the manager.
     *
     * Requirements:
     * - `msg.sender` cannot be the zero address
     * - `msg.value` must be equal to the price of the tournament 
     * - `_id` must be greater than 0 and less than the length of the array
     * 
     * @param _id id of the tournament
     * @param _firstName first name of the player
     * @param _lastName last name of the player
     */
    function registerPlayer(uint _id, bytes32 _firstName, bytes32 _lastName) payable external;

    /**
     * @dev Add the two winners of the tournament and call the mint function to send them a NFT reward.
     *
     * Requirements:
     * - `msg.sender` can only be the owner
     * - `_id` must be greater than 0 and less than the length of the array
     * - `_winner1` cannot be the zero address
     * - `_winner2` cannot be the zero address
     * 
     * @param _id id of the tournament
     * @param _winner1 the address of one of the winner
     * @param _winner1 the address of the other winner
     */
    function addWinners(uint _id, address _winner1, address _winner2) external;

    /**
     * @dev Add comment to the forum of a tournament.
     *
     * Requirements:
     * - `id` must be greater than 0 and less than the length of the array
     * - `_author` cannot be the zero address
     * - `_message` cannot be empty
     *
     * Emits a {TournamentCommentAdded} event.
     * 
     * @param _id id of the tournament
     * @param _author the author of the comment
     * @param _message the message to add
     */
    function addComment(uint _id, address _author, string calldata _message) external;

    /**
     * @dev Add comment to a manager of a tournament.
     *
     * Requirements:
     * - `id` must be greater than 0 and less than the length of the array
     * - `_author` cannot be the zero address
     * - `_message` cannot be empty
     *
     * Emits a {PrivateCommentAdded} event.
     * 
     * @param _id id of the tournament
     * @param _author the author of the comment
     * @param _message the message to add
     */
    function addPrivateComment(uint _id, address _author, string calldata _message) external;
}