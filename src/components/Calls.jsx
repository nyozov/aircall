import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiPhoneMissedCall, HiPhoneOutgoing } from "react-icons/hi";
import { BsVoicemail } from "react-icons/bs";
import CloseIcon from "@mui/icons-material/Close";
import {
  Modal,
  Tabs,
  Tab,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";

//MUI modal default styling
const style = {
  position: "absolute",
  top: "50%",
  borderRadius: "10px",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "rgba(0, 0, 0, 0.8)",

  boxShadow: 24,
  p: 4,
};

//main display, 2 tabs - inbox/archive

export default function Calls() {
  //calls from api state
  const [showCalls, setShowCalls] = useState({
    calls: [],
  });
  //main tab state could be Inbox or Archive
  const [state, setState] = useState("Inbox");
  //modal state
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //call id state for post requests
  const [callId, setCallId] = useState("");

  //update states get - used on tab changing
  function update() {
    axios.get(`https://aircall-job.herokuapp.com/activities`).then((res) => {
      setShowCalls({ calls: res.data });
    });
  }

  //main get
  useEffect(() => {
    axios.get(`https://aircall-job.herokuapp.com/activities`).then((res) => {
      setShowCalls({ calls: res.data });
    });

  }, []);

  const archive = () => {
    axios
      .post(`https://aircall-job.herokuapp.com/activities/${callId}`, {
        is_archived: true,
      })
      .then(
        setShowCalls((prevState) => ({
          calls: prevState.calls.filter((call) => call.id != callId),
        }))
      )
      .then(setShowCalls([...showCalls, res.data]))
  };

  const unarchive = () => {
    axios
      .post(`https://aircall-job.herokuapp.com/activities/${callId}`, {
        is_archived: false,
      })
      .then(
        setShowCalls((prevState) => ({
          calls: prevState.calls.filter((call) => call.id != callId),
        }))
      )
      .then(setShowCalls([...showCalls, res.data]))
      
  };

  const reset = () => {
    axios.get("https://aircall-job.herokuapp.com/reset").then(
      setShowCalls((prevState) => ({
        calls: prevState.calls.filter((call) => call.is_archived == "true"),
      }))
    );
  };

  //MUI Tabs for inbox/archive
  const ColorTabs = () => {
    const handleChange = (event, newValue) => {
      update();
      setState(newValue);
    };

    return (
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={state}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="secondary tabs example"
        >
          <Tab style={{ color: "white" }} value="Inbox" label="Inbox" />
          <Tab style={{ color: "white" }} value="Archive" label="Archive" />
        </Tabs>
      </Box>
    );
  };
  return (
    <div className="call-container">
      <div className="tabs">
        <div className="fixed-tabs">
          <ColorTabs />
        </div>
      </div>
      {/* display when state = inbox */}
      {state === "Inbox" && (
        <div>
          {showCalls.calls.map((call) => {
            if (!call.is_archived)
              return (
                <div>
                  <div className="date-divider">
                    - - - - {call.created_at.slice(0, 10)} - - - -
                  </div>

                  <div
                    className="call"
                    onClick={() => {
                      handleOpen();
                      setCallId(call.id);
                    }}
                  >
                    <div className="phone-icon">
                      {call.call_type === "missed" && (
                        <HiPhoneMissedCall size="2em" />
                      )}
                      {call.call_type === "answered" && (
                        <HiPhoneOutgoing size="2em" />
                      )}
                      {call.call_type === "voicemail" && (
                        <BsVoicemail size="2em" />
                      )}
                    </div>
                    <div className="caller">
                      <p>{call.to || "Unknown"}</p>

                      <p className="small-text">tried to call on {call.from}</p>
                    </div>
                    <div className="timestamp">
                      {call.created_at.slice(11, 16)}
                    </div>
                  </div>
                </div>
              );
          })}
          <div className="modal">
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="modal-close">
                  <IconButton color="error" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </div>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                ></Typography>
                {showCalls.calls.map((call) => {
                  if (call.id === callId) {
                    return (
                      <div>
                        <p className="modal-title">Call Information</p>
                        <ul className="modal-list">
                          <li>
                            <b>Date:</b> {call.created_at}
                          </li>
                          <li>
                            <b>From:</b> {call.from}
                          </li>
                          <li>
                            <b>To: </b>
                            {call.to}
                          </li>
                          <li>
                            <b>Duration: </b>
                            {call.duration} seconds
                          </li>
                          <li>
                            <b>Direction: </b>
                            {call.direction}
                          </li>
                          <li>
                            <b>Via:</b> {call.via}
                          </li>
                          <li>
                            <b>Type: </b>
                            {call.call_type}
                          </li>
                        </ul>
                      </div>
                    );
                  }
                })}
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                ></Typography>
                <div className="modal-archive">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      handleClose();
                      archive();
                    }}
                  >
                    Archive Call
                  </Button>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      )}
      {/* display when state = archive */}
      {state === "Archive" && (
        <div>
          {showCalls.calls.map((call) => {
            if (call.is_archived)
              return (
                <div>
                  <div className="date-divider">
                    - - - - {call.created_at.slice(0, 10)} - - - -
                  </div>

                  <div
                    className="call"
                    onClick={() => {
                      handleOpen();
                      setCallId(call.id);
                    }}
                  >
                    <div className="phone-icon">
                      {call.call_type === "missed" && (
                        <HiPhoneMissedCall size="2em" />
                      )}
                      {call.call_type === "answered" && (
                        <HiPhoneOutgoing size="2em" />
                      )}
                      {call.call_type === "voicemail" && (
                        <BsVoicemail size="2em" />
                      )}
                    </div>
                    <div className="caller">
                      <p>{call.to || "Unknown"}</p>

                      <p className="small-text">tried to call on {call.from}</p>
                    </div>
                    <div className="timestamp">
                      {call.created_at.slice(11, 16)}
                    </div>
                  </div>
                </div>
              );
          })}
          <div className="modal">
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="modal-close">
                  <IconButton color="error" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </div>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                ></Typography>
                {showCalls.calls.map((call) => {
                  if (call.id === callId) {
                    return (
                      <div>
                        <p className="modal-title">Call Information</p>
                        <ul className="modal-list">
                          <li>
                            <b>Date:</b> {call.created_at}
                          </li>
                          <li>
                            <b>From:</b> {call.from}
                          </li>
                          <li>
                            <b>To: </b>
                            {call.to}
                          </li>
                          <li>
                            <b>Duration: </b>
                            {call.duration} seconds
                          </li>
                          <li>
                            <b>Direction: </b>
                            {call.direction}
                          </li>
                          <li>
                            <b>Via:</b> {call.via}
                          </li>
                          <li>
                            <b>Type: </b>
                            {call.call_type}
                          </li>
                        </ul>
                      </div>
                    );
                  }
                })}
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2 }}
                ></Typography>
                <div className="modal-archive">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    onClick={() => {
                      handleClose();
                      unarchive();
                    }}
                  >
                    Move to Inbox
                  </Button>
                </div>
              </Box>
            </Modal>
          </div>
          <div className="reset-button">
            <Button variant="contained" onClick={reset}>
              reset all archived
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
