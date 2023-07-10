// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/// @title Library for difficulties
/// @dev Library for manage the difficulties of the tournaments
/// @author Mickael Blondeau
library LibraryDifficulty {
    
    /// @notice Enum of the differents diffulcties of the tournaments
    enum Difficulty {
        p25,
        p100,
        p250,
        p500,
        p1000,
        p2000,
        UNKNOWN
    }

    /// @notice Returns the difficulty value from the enum
    /// @param _difficulty the difficulty in uint
    /// @return the difficulty from the enum
    function getDifficultyFromUint(uint _difficulty) public pure returns(Difficulty) {
        if(_difficulty == 0) return Difficulty.p25; 
        if(_difficulty == 1) return Difficulty.p100;
        if(_difficulty == 2) return Difficulty.p250;
        if(_difficulty == 3) return Difficulty.p500;
        if(_difficulty == 4) return Difficulty.p1000;
        if(_difficulty == 5) return Difficulty.p2000;
        return Difficulty.UNKNOWN;
    }
}
