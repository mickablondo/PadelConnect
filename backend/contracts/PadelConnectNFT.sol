// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title PadelConnect - NFT
/// @dev This contract mints a NFT to the winners of a tournament.
/// @author Mickael Blondeau
contract PadelConnectNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    /// @notice URI of the token
    string constant _tokenURI = "https://gateway.pinata.cloud/ipfs/Qmex4uN7nkXfT6Yt2ZqhmtcmZNkSoDWJ7SJVqJiMaV1z4y";

    /// @notice Description of a reward
    struct Reward {
        uint tournamentId;
        string tournamentCity;
        string firstName;
        string lastName;
    }

    /// @notice Map of a position to the metadatas of a reward
    mapping(uint256 => Reward) rewards;
 
    constructor() ERC721 ("PadelConnect", "PDL") {}
 
    /// @dev Mint NFT for the winner
    /// @param _player address of the winner
    /// @param _tournamentId id of the tournament
    /// @param _city name of the city of the tournament
    /// @param _firstName first name of the winner
    /// @param _lastName last name of the winner
    function MintReward(
        address _player,
        uint _tournamentId,
        string memory _city,
        string memory _firstName,
        string memory _lastName
    ) internal onlyOwner() {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        rewards[newItemId] = Reward(_tournamentId, _city, _firstName, _lastName);
        _mint(_player, newItemId);
        _setTokenURI(newItemId, _tokenURI);
    }
}
