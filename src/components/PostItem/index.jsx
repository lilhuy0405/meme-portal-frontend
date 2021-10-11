/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { BsArrowUpCircle, BsShare } from 'react-icons/bs';
import './style.scss';

const PostItem = ({ item }) => {
  return (
    <div className='post-controller'>
      <div className='post'>
        <div className='post-header'>
          <div className='post-logo'>
            <img src={item.creator.avatar} />
          </div>
          <div className='post-name-time'>
            <div className='post-name'>{item.creator.name}</div>
            <div className='post-time'>{item.time}</div>
          </div>
        </div>
        <div className='post-detail'>
          <div className='post-title'>{item.title}</div>
          <p>{item.description}</p>
        </div>
        <div className='post-image'>
          <img src={item.image} />
        </div>
        <div className='post-emotion'>
          <div className='post-emotion-up'>
            <div className='post-emotion-like'>
              <AiOutlineLike />
              {item.likesCount}
            </div>
            <div className='post-emotion-vote'>
              <BsArrowUpCircle />
              34
            </div>
          </div>
          <div className='post-emotion-share'>
            <BsShare />
            Share
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;