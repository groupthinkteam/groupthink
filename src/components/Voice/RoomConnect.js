import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import * as SWRTC from '@andyet/simplewebrtc';
import '../../styles/VoiceRoom.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../store/hook';

import Popup from "../PopupMenu/PopupMenu"
import { joinCall, leaveCall, removeAllMedia } from '@andyet/simplewebrtc/actions';

const API_KEY = '120319f9263e8477a01064c0';

const ROOM_PASSWORD = 'default';
const CONFIG_URL = `https://api.simplewebrtc.com/config/guest/${API_KEY}`;
const store = SWRTC.createStore();

const RoomConnect = (props) => {
  const ROOM_NAME = props.projectID;
  const [isJoined, setIsJoined] = useState(false);
  const globalStore = useStore();
  const [isPopupExpanded, setPopupExpanded] = useState(false);

  useEffect(() => {
    const me = globalStore.users[globalStore.userID];
    if (isJoined) {
      globalStore.addUserCallInfo();
    }
    if (!isJoined && me?.joinedCall) {
      globalStore.removeUserCallInfo();
    }
  }, [isJoined, globalStore])

  return (
    <div className="voice-room">
      <div className="call-ui-collapsed" onClick={() => setPopupExpanded(true)}>
        <img alt="open voice call menu" src={require("../../assets/voice/voice.svg")} />
      </div>
      <Provider store={store}>
        <SWRTC.Provider configUrl={CONFIG_URL} displayName={props.currentUser.uid}>
          <SWRTC.Connecting>
            <p>Connecting...</p>
          </SWRTC.Connecting>
          <SWRTC.Connected>
            <div>
              <SWRTC.Room name={ROOM_NAME} password={ROOM_PASSWORD}>
                {roomprops =>
                  <>
                    {isJoined ?
                      <>
                        <SWRTC.RequestUserMedia audio auto audioTypeHint="speech" />
                        <SWRTC.RemoteAudioPlayer />
                      </>
                      : null
                    }
                    {isPopupExpanded ?
                      <Popup handleClose={() => setPopupExpanded(false)}>
                        <div className="voice-container">
                          <div className="title">
                            Voice Call
                    </div>
                          <div className="subtitle">
                            Voice calls help you collaborate effortlessly with others on the project.
                    </div>
                          <div className="section-heading">
                            Call controls
                    </div>
                          <div className="call-controls">
                            {
                              isJoined ?
                                <button className="leave-call"
                                  onClick={() => {
                                    leaveCall(roomprops.room.address, true);
                                    setIsJoined(false);
                                    console.log("remove media", removeAllMedia("audio"));
                                  }}>
                                  Leave Call
                              </button>
                                : <button className="join-call"
                                  onClick={() => {
                                    joinCall(roomprops.room.address);
                                    setIsJoined(true)
                                  }}>
                                  Join Call
                              </button>
                            }
                            {
                              isJoined ?
                                <SWRTC.UserControls>
                                  {userprops =>
                                    <div className="mute-unmute" onClick={() => { userprops.isMuted ? userprops.unmute() : userprops.mute() }}>
                                      {userprops.isMuted ? "Unmute" : "Click to Mute"}
                                    </div>
                                  }
                                </SWRTC.UserControls>
                                : null
                            }
                          </div>
                          <div className="section-heading">
                            Currently on the call ({roomprops.peers.filter((peer) => globalStore.users[peer.displayName]["joinedCall"]).length})
                        </div>
                          <div className="users-list">
                            {
                              roomprops.peers.filter((peer) => globalStore.users[peer.displayName]["joinedCall"]).length < 1
                                ? <span className="subtitle">There are no users on the call yet.</span>
                                : roomprops.peers.filter((peer) => globalStore.users[peer.displayName]["joinedCall"]).map((peer) => {
                                  // displayName is actually uid
                                  let user = globalStore.users[peer.displayName]
                                  console.log(peer)
                                  return (
                                    <div key={"voiceuserlist" + peer.displayName} className="users-list-item">
                                      <img src={user.photoURL} alt={user.name} className="user-profile" />
                                      {user.name} {peer.speaking ? "is speaking" : null}
                                    </div>
                                  )
                                })}
                          </div>
                        </div>
                      </Popup>
                      : null}
                  </>
                }
              </SWRTC.Room>
            </div>
          </SWRTC.Connected>
          <SWRTC.Disconnected>
            Lost Connection
          </SWRTC.Disconnected>
        </SWRTC.Provider>
      </Provider>
    </div >
  )
}

export default observer(RoomConnect);