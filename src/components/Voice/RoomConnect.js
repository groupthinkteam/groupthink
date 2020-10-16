import React, { useState } from 'react';
import { Provider } from 'react-redux';
import * as SWRTC from '@andyet/simplewebrtc';
import '../../styles/VoiceRoom.scss';
import { getRoomByAddress } from '@andyet/simplewebrtc/Selectors';
//const API_KEY = 'INSERT API KEY';
const API_KEY = '120319f9263e8477a01064c0';
const ROOM_NAME = "document_id";
const ROOM_PASSWORD = 'defauly';
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;
const store = SWRTC.createStore();

const style = {

  position: "absolute",
  width: "46px",
  height: "46px",
  left: "1305px",
  top: "8px",

  background:"#FFFFFF",
  /* gt call green */

  border: "2px solid #42AE1D",
  boxSizing: "border-box",
  borderRadius: "100px"
}
const RoomConnect = (props) => {
    const [isJoined, setIsJoined] = useState(false);
    const [mute , setMute] = useState(true);
    return (
      <div className="">
        <Provider store={store}>
          <SWRTC.Provider configUrl={CONFIG_URL} displayName={props.currentUser.displayName}>
            <SWRTC.Connecting>
              <p>Connecting...</p>
            </SWRTC.Connecting>
  
            <SWRTC.Connected>
              <button className={(isJoined ? "room-connect disconnect" : "room-connect connected ")}  onClick={() => setIsJoined(!isJoined)}>
                {isJoined ? "Leave" : "Join"
                }
              </button>
              <SWRTC.RequestUserMedia audio auto />
              <SWRTC.RemoteAudioPlayer />
              {isJoined ?
                <SWRTC.Room name={ROOM_NAME} password={ROOM_PASSWORD} >
                  {roomprops =>
                    <div>
                      
                      {roomprops.peers.map(
                        (peer) => <PeerItem peer={peer} />
                      )
                      }
                      <SWRTC.UserControls>
                        {userprops =>
                          <button  onClick={() =>{console.log("MUTE ",userprops.isMuted,mute); setMute(!mute); mute ? userprops.unmute() : userprops.mute()}}>
                            {mute  ? "Unmute" : "Mute"}
                          </button>
                        }
                      </SWRTC.UserControls>
                    </div>
                  }
                </SWRTC.Room>
                : null}
            </SWRTC.Connected>
            <SWRTC.Disconnected>
              Lost Connection
              </SWRTC.Disconnected>
          </SWRTC.Provider>
        </Provider>
      </div >
    )
  }

  function PeerItem(props) {
    return (
      <div className="peer-item" style={{ border: "2px solid black" }}>
        Peer Name: {props.peer.displayName} {props.peer.speaking ? "is speaking" : null}
      </div>
    )
  }

export default RoomConnect;