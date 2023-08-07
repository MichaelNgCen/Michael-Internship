import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";
import Countdown from "../UI/Countdown";
import Skeleton from "react-loading-skeleton";

const ExploreItems = () => {
  const [exploreItems, setExploreItems] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const maxImagePerRow = 4;

  const [next, setNext] = useState(8);

  const handleLoadMore = () => {
    setNext(next + maxImagePerRow);
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://us-central1-nft-cloud-functions.cloudfunctions.net/explore")
      .then((res) => {
        setExploreItems(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function filter(value) {
    setIsLoading(true);
    const { data } = await axios.get(
      `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=${value}`
    );
    setExploreItems(data);
    setIsLoading(false);
  }

  return (
    <>
      <div>
        <select
          id="filter-items"
          defaultValue="Default"
          onChange={(event) => filter(event.target.value)}
        >
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      {isLoading
        ? new Array(8).fill(0).map((_, index) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Skeleton
                    height={"50px"}
                    width={"50px"}
                    borderRadius={"50%"}
                  />
                  <i className="fa fa-check"></i>
                </div>
                <div
                  style={{
                    position: "absolute",
                    display: "inline-block",
                    right: "20px",
                  }}
                >
                  <Skeleton
                    height={"32px"}
                    width={"110px"}
                    borderRadius={"30px"}
                    border={"none"}
                  />
                </div>
                <div className="nft__item_wrap">
                  <Link to="/item-details">
                    <Skeleton
                      height={"219px"}
                      width={"219px"}
                      borderRadius={"8px"}
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to="/item-details">
                    <h4>
                      <Skeleton height={"1rem"} width={"5rem"} />
                    </h4>
                  </Link>
                  <div
                    style={{
                      display: "block",
                    }}
                  >
                    <Skeleton height={"1rem"} width={"3rem"} />
                  </div>
                  <div className="nft__item_like">
                    <span>
                      <Skeleton height={".75rem"} width={"1rem"} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        : exploreItems?.slice(0, next)?.map((exploreItem, index) => (
            <div
              key={index}
              className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
              style={{ display: "block", backgroundSize: "cover" }}
            >
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link
                    to={`/author/${exploreItem.authorId}`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                  >
                    <img
                      className="lazy"
                      src={exploreItem.authorImage}
                      alt=""
                    />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                {exploreItem.expiryDate && (
                  <Countdown expiryDate={exploreItem.expiryDate} />
                )}
                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="" target="_blank" rel="noreferrer">
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="">
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to="/item-details/${exploreItems?.nftId}">
                    <img
                      src={exploreItem.nftImage}
                      className="lazy nft__item_preview"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to={`/item-details/${exploreItem?.nftId}`}>
                    <h4>{exploreItem.title}</h4>
                  </Link>
                  <div className="nft__item_price">{exploreItem.price} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{exploreItem.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      <div className="col-md-12 text-center">
        {next < exploreItems?.length && (
          <Link
            to=""
            id="loadmore"
            className="btn-main lead"
            onClick={handleLoadMore}
          >
            Load more
          </Link>
        )}
      </div>
    </>
  );
};

export default ExploreItems;
