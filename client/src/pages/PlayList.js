import React from "react";

export function PlayList() {
  return (
    <div id="playlistpage">
      <div id="isPlay">Stopped</div>
      <div id="audio">
        <audio id="audio1" preload controls></audio>
      </div>
    </div>
  );
}