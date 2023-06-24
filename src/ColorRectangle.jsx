import React from 'react';

const ColorRectangle = ({ hexString, feedbackText, correctIndex, hideFeedback, feedbackTextColor }) => {
    const colorStyle = {backgroundColor: `#${hexString}`};
    const feedbackStyle = {color: feedbackTextColor};
    const showFeedback = correctIndex === 0 || hideFeedback;

    return (
        <div className='color-rectangle' style={colorStyle}>
            <div className={showFeedback ? 'directions' : 'directions fading'} style={feedbackStyle}>
                {feedbackText}<br />
                {/* remove arrow after first correct answer */}
                <div className='arrow floating' style={{ visibility: correctIndex > 0 ? 'hidden' : '' }}>
                    <svg fill="#ffffff" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="-51.2 -51.2 614.42 614.42" stroke="#ffffff">
                        <g id="SVGRepo_iconCarrier"> <g> <g> <g>
                            <path d="M248.436,295.417c4.16,4.16,10.88,4.16,15.04,0L434.143,124.75c4.053-4.267,3.947-10.987-0.213-15.04 c-4.16-3.947-10.667-3.947-14.827,0L256.009,272.803L92.916,109.71c-4.267-4.053-10.987-3.947-15.04,0.213 c-3.947,4.16-3.947,10.667,0,14.827L248.436,295.417z"></path>
                        </g> </g> </g> </g></svg>
                </div>
            </div>
        </div>
    );
};

export default ColorRectangle;
