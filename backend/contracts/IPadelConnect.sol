// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

/// @title Padel tournament management contract
/// @notice This interface shows how to interact with the Smart Contract.
/// @author Mickaël Blondeau
interface IPadelConnect {

    /// @notice Enum of the differents diffulcties of the tournaments
    enum Difficulty {
        p25,
        p100,
        p250,
        p500,
        p1000,
        p2000
    }

    /// @notice Description of a tournament
    struct Tournament {
        uint id;
        string city;
        uint date;
        Difficulty difficulty;
        uint8 maxPlayers;
        uint8 registrationsAvailable;
        address winner1;
        address winner2;
    }

    /// @notice Description of a manager
    struct Manager {
        string lastName;
        string firstName;
        bool isRegistered;
    }

    /// @notice Description of a player
    struct Player {
        string lastName;
        string firstName;
    }

    /// @notice Description of a Comment
    struct Comment {
        string message;
        address author;
    }

    /**
     * @dev Emitted when owner adds a new manager.
     */
    event ManagerAdded(address _address);

    /**
     * @dev Emitted when manager adds a new tournament.
     */
    event TournamentCreated(string city, uint date);

    /**
     * @dev Emitted when somebody adds a new comment on a tournament forum.
     */
    event TournamentCommentAdded(uint tournamentId);

    /**
     * @dev Emitted when player adds a comment to a manager.
     */
    event PrivateCommentAdded(uint tournamentId, address player);

    /**
     * @dev Emitted when a manager adds a response to a player..
     */
    event PrivateResponseAdded(uint tournamentId, address player);

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
    function addManager(address _address, string calldata _firstName, string calldata _lastName) external;

    /**
     * @dev Add a new tournament.
     *
     * Requirements:
     * - `msg.sender` can only be a manager
     * - `_city` cannont be empty
     * - `_date` must be in the future
     * - `_maxPlayers` must be a multiple of two and greater than 0
     *
     * Emits a {TournamentCreated} event.
     *
     * @param _city city name of the new tournament 
     * @param _date date of the new tournament
     * @param _diff the difficulty of the tournament
     * @param _maxPlayers maximum number of players
     */
    function addTournament(string calldata _city, uint _date, uint8 _diff, uint8 _maxPlayers) external;

    /**
     * @dev Register a player to a tournament and pay the manager.
     *
     * Requirements:
     * - `_id` must be less than the length of the array
     * - `_firstName` cannot be empty
     * - `_lastName` cannot be empty
     * - date of the registration must be less than the start date of the tournament
     * 
     * @param _id id of the tournament
     * @param _firstName first name of the player
     * @param _lastName last name of the player
     */
    function registerPlayer(uint _id, string calldata _firstName, string calldata _lastName) external;

    /**
     * @dev Add the two winners of the tournament and call the mint function to send them a NFT reward.
     *
     * Requirements:
     * - `msg.sender` can only be the owner
     * - `_id` must be less than the length of the array
     * - `_winner1` cannot be the zero address
     * - `_winner2` cannot be the zero address
     * - `_winner1` and `_winner2` cannot be the same addresses
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
     * - `_id` must be less than the length of the array
     * - `_message` cannot be empty
     *
     * Emits a {TournamentCommentAdded} event.
     * 
     * @param _id id of the tournament which represents a subject of the forum
     * @param _message the message to add
     */
    function addComment(uint _id, string calldata _message) external;

    /**
     * @dev Follow the discussion of a tournament.
     *
     * Requirements:
     * - `_id` must be less than the length of the array
     * 
     * @param _id id of the tournament followed by msg.sender
     */
    function followTournament(uint _id) external;

    /**
     * @dev Add comment to a manager of a tournament.
     *
     * Requirements:
     * - `_id` must be less than the length of the array
     * - `_message` cannot be empty
     *
     * Emits a {PrivateCommentAdded} event.
     * 
     * @param _id id of the tournament which represents a subject of the forum
     * @param _message the message to add
     */
    function addPrivateCommentToManager(uint _id, string calldata _message) external;

    /**
     * @dev Add response to a player of a tournament.
     *
     * Requirements:
     * - `_id` must be less than the length of the array
     * - `_player` cannot be the zero address
     * - `_message` cannot be empty
     *
     * Emits a {PrivateCommentAdded} event.
     * 
     * @param _id id of the tournament which represents a subject of the forum
     * @param _player address of the player
     * @param _message the message to add
     */
    function addPrivateResponseToPlayer(uint _id, address _player, string calldata _message) external;
}
