
export const VideoPlayer = ({url}) => {
  return (
    <div className="video-player">
      <video width="100%" controls>
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

