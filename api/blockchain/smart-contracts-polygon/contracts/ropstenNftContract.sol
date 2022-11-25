
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// ::: implements the ERC721 standard
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// ::: keeps track of the number of tokens issued
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/math
// ::: Accessing the Ownable method ensures that only the creator of the smart contract can interact with it
contract ropstenNftContract is ERC721URIStorage{
    using Counters for Counters.Counter;
    uint public _tokenIds;
    string public hh="nft contract";
    address public owner ;
    uint public listingPrice=10;
    uint public listingDuration;
    uint public listingStart;
    uint public listingEnd;
    uint public _itemsSold;
    uint public _itemsAvailable;
    uint public _itemsTotal;
    uint public _itemsSoldPerSecond;
    uint public _itemsAvailablePerSecond;
    struct  Listing{
        string owner;
        uint  price;
    }Listing listing; 

    // :::::::::::::::::     the contract name and contract symbol for the NFT
    constructor () public ERC721("nftContract", "nftTk"){
        _tokenIds = _tokenIds+1;
        owner =msg.sender;
    }
        /****
        ::: Create a function to mint/create the NFT
        ::: receiver takes a type of address. This is the wallet address of the user that should receive the NFT minted using the smart contract
        ::: tokenURI takes a string that contains metadata about the NFT
        ::: this is the process of minting an nft, creating a unique token 
        *** */
    modifier ownerOnly() {
        require(
            msg.sender == owner, "This function is restricted to the contract's owner"
            );
        _;
    }
    function getListingPrice()public returns(uint) {
        return listingPrice;
    }
    function getHi()public returns(string memory) {
        return hh;
    }
    function setListingPrice(uint _listingPrice)public  {
        listingPrice = _listingPrice;

    }
    function createNFT(address receiver, string memory tokenURI) public returns (uint){
        //require(msg.value >= 10, "Not enough ETH sent; check price!");
        _tokenIds=_tokenIds+1;
        uint newItemId = _tokenIds;
        //uint public constant MAX_SUPPLY = 100;
        //uint public constant PRICE = 0.01 ether;
        //uint public constant MAX_PER_MINT = 5;
        //string public baseTokenURI;
        _mint(receiver, newItemId);
        _setTokenURI(newItemId, tokenURI);
        // ::: returns the id for the newly created token
        // ::: returns the id for the newly created token
        return newItemId;
    }

    /****
    ::: this checks for certain parameters before minting
    :::
    :::
    ****/
    /*
    function mintNFTs(uint _count) public payable {
        uint totalMinted = _tokenIds.current();
        require(
        totalMinted.add(_count) <= MAX_SUPPLY, "Not enough NFTs!"
        );
        require(
        _count > 0 && _count <= MAX_PER_MINT, 
        "Cannot mint specified number of NFTs."
        );
        require(
        msg.value >= PRICE.mul(_count), 
        "Not enough ether to purchase NFTs."
        );
        for (uint i = 0; i < _count; i++) {
            _mintSingleNFT();
        }
    }
    *
        /****
        ::: Create a function to mint/create the NFT
        ::: receiver takes a type of address. This is the wallet address of the user that should receive the NFT minted using the smart contract
        ::: tokenURI takes a string that contains metadata about the NFT
        *** */
    /*
    function addItemToMarket( address nftContractAddress, uint256 tokenId, uint256 price  ) public payable  {
        require(price > 0, "Price must be at least 1 wei");
        require(msg.value == listingPrice, "Price must be equal to listing price");
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        idToMarketItem[itemId] =  MarketItem(
            itemId,
            nftContractAddress,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price
        );
        IERC721(nftContractAddress).safeTransferFrom(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            itemId,
            nftContractAddress,
            tokenId,
            msg.sender,
            address(0),
            price
        );
    }
    function mintToken(address to, uint256 tokenId, string uri) public virtual payable {
        require(msg.value >= 10, "Not enough ETH sent; check price!");
        mint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }
    */
    /*
    function sellItemAndTransferOwnership( address nftContractAddress, uint256 itemId) 
        public payable  {
            uint price = idToMarketItem[itemId].price;
            uint tokenId = idToMarketItem[itemId].tokenId;
            require(msg.value == price, "Please submit the asking price in order to complete the purchase");
            idToMarketItem[itemId].seller.transfer(msg.value);
            IERC721(nftContractAddress).transferFrom(address(this), msg.sender, tokenId);
            idToMarketItem[itemId].owner = payable(msg.sender);
            _itemsSold.increment();
            payable(owner).transfer(listingPrice);
    }
    */
    // ::::::::::::::
    /*
    balanceOf(owner)
    ownerOf(tokenId)
    approve(to, tokenId)
    getApproved(tokenId)
    setApprovalForAll(to, approved)
    isApprovedForAll(owner, operator)
    transferFrom(from, to, tokenId)
    safeTransferFrom(from, to, tokenId)
    safeTransferFrom(from, to, tokenId, _data)
    _safeTransferFrom(from, to, tokenId, _data)
    _exists(tokenId)
    _isApprovedOrOwner(spender, tokenId)
    _safeMint(to, tokenId)
    _safeMint(to, tokenId, _data)
    _mint(to, tokenId)
    _burn(owner, tokenId)
    _burn(tokenId)
    _transferFrom(from, to, tokenId)
    _checkOnERC721Received(from, to, tokenId, _data)
    */
}