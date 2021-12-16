import React, { useState, useEffect } from "react";
import axios from "axios";
import { HiPhoneMissedCall } from "react-icons/hi";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  borderRadius: "10px",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Calls() {
  const [showCalls, setShowCalls] = useState({
    calls: [],
  });
  const [state, setState] = useState("Inbox");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [callId, setCallId] = useState("");

  const update = () => {
    axios.get(`https://aircall-job.herokuapp.com/activities`).then((res) => {
      console.log(res);
      setShowCalls({ calls: res.data });
    });
  };
  useEffect(() => {
    axios.get(`https://aircall-job.herokuapp.com/activities`).then((res) => {
      console.log(res);
      setShowCalls({ calls: res.data });
    });

    console.log("test", showCalls);
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
      .then(console.log(showCalls));
  };

  const reset = () => {
    axios.get("https://aircall-job.herokuapp.com/reset").then(
      setShowCalls((prevState) => ({
        calls: prevState.calls.filter((call) => call.is_archived == "true"),
      }))
    );
  };
  return (
    <div className="call-container">
      <div className="buttons">
        <button
          onClick={() => {
            update();

            setState("Inbox");
          }}
        >
          Inbox
        </button>
        <button
          onClick={() => {
            update();
            setState("Archive");
          }}
        >
          Archive
        </button>
      </div>
      {state === "Inbox" && (
        <div>
          {showCalls.calls.map((call) => {
            if (!call.is_archived)
              return (
                <div
                  onClick={() => {
                    handleOpen();
                    setCallId(call.id);
                  }}
                >
                  <div className="date-divider">
                    - - - - {call.created_at.slice(0, 10)} - - - -
                  </div>

                  <div className="call">
                    <div className="phone-icon">
                      <HiPhoneMissedCall size="2em" />
                    </div>
                    <div className="caller">
                      <p>{call.to || "Unknown"}</p>

                      <p className="small-text">tried to call on {call.from}</p>
                    </div>
                    <div className="timestamp">
                      {call.created_at.slice(11, 16)}
                      <p>id:{call.id}</p>
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
                <Button onClick={handleClose}>Close</Button>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  id: {callId}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Duis mollis, est non commodo luctus, nisi erat porttitor
                  ligula.
                </Typography>
                <Button
                  onClick={() => {
                    handleClose();
                    archive();
                  }}
                >
                  Archive Call
                </Button>
              </Box>
            </Modal>
          </div>
        </div>
      )}

      {state === "Archive" && (
        <div>
          {showCalls.calls.map((call) => {
            if (call.is_archived)
              return (
                <div>
                  <div className="date-divider">
                    - - - - {call.created_at.slice(0, 10)} - - - -
                  </div>

                  <div className="call">
                    <div className="phone-icon">
                      <HiPhoneMissedCall size="2em" />
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
          <button onClick={reset}>reset all archived</button>
        </div>
      )}
    </div>
  );
}
