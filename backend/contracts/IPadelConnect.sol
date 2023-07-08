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
     * - `address` cannont be the zero address
     * - `address` cannot be ever registering
     * - `firstName` cannot be empty
     * - `lastName` cannot be empty
     *
     * Emits a {ManagerAdded} event.
     */
    function addManager(address _address, bytes32 firstName, bytes32 lastName) external;

    function addTournament() external;
    function getTournament() external view returns(Tournament memory);
    function registerPlayer() external;
    function addWinners() external;
    function addComment() external;
    function addPrivateComment() external;
}