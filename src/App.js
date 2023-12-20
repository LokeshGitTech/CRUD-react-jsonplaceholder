import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "./instance/instance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [userData, setUserData] = useState([]);
  const [userInputId, setUserInputId] = useState("");
  const [userInputName, setUserInputName] = useState("");
  const [editUserData, setEditUserData] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/users").then((res) => {
      setUserData(res.data);
    });
  }, []);

  const userInput = (event) => {
    const { name, value } = event.target;
    if (name === "id") {
      setUserInputId(value);
    } else if (name === "name") {
      setUserInputName(value);
    }
  };

  const userSubmit = async () => {
    if (editUserData) {
      const updatedUser = {
        id: userInputId,
        name: userInputName,
      };

      await axios.put(
        `https://jsonplaceholder.typicode.com/users/${editUserData.id}`,
        updatedUser
      );

      // Update the user in the userData array
      const updatedUserData = userData.map((user) =>
        user.id === editUserData.id ? updatedUser : user
      );

      setUserData(updatedUserData);
      setEditUserData(null); // Clear editUserData

      toast("User Updated Successfully!");
    } else {
      try {
        const response = await axios.post(
          "https://jsonplaceholder.typicode.com/users",
          {
            id: userInputId,
            name: userInputName,
          }
        );

        setUserData([...userData, response.data]);

        setUserInputId("");
        setUserInputName("");

        toast("Login Successfully!");
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    }
  };

  const deleteUser = async (userId) => {
    setDeletingUserId(userId); // Set the user ID being deleted
    setShowDeleteConfirmation(true); // Open the confirmation dialog
  };

  const confirmDelete = async () => {
    if (deletingUserId !== null) {
      try {
        await axios.delete(
          `https://jsonplaceholder.typicode.com/users/${deletingUserId}`
        );
        const updatedUserData = userData.filter(
          (user) => user.id !== deletingUserId
        );
        setUserData(updatedUserData);
        setShowDeleteConfirmation(false); // Close the confirmation dialog

        toast("User Deleted Successfully!");
      } catch (error) {
        console.error("Error deleting user:", error);
      } finally {
        setDeletingUserId(null); // Reset the deletingUserId
      }
    }
  };

  const editUser = async (userId) => {
    const editUser = userData.find((e) => e.id === userId);
    console.log("editUser", editUser.id);
    setUserInputId(editUser.id);
    setUserInputName(editUser.name);
    setEditUserData(editUser);
  };

  return (
    <>
      <div className="" style={{ border: "5px solid grey" , backgroundColor: "#fcf7f7 "}}>
        <div className="d-flex justify-content-center py-5 "  >
          <div
            className=" p-4 border"
            style={{ width: "700px", backgroundColor: "#fcf7f7 " }}
          >
            <label className="mx-3">Id</label>
            <input
              placeholder="Enter id"
              name="id"
              value={userInputId}
              onChange={userInput}
            ></input>
            <label className="mx-3">Name</label>
            <input
              placeholder="Enter name"
              name="name"
              value={userInputName}
              onChange={userInput}
            ></input>

            <input
              type="submit"
              value={editUserData ? "Update" : "Submit"}
              className="mx-3"
              onClick={userSubmit}
            ></input>
          </div>
        </div>
        <div className="d-flex justify-content-center  ">
          <table
            className="table table-striped table-hover my-2 border border-primary "
            style={{ width: "700px" }}
          >
            <thead>
              <tr className="bg-primary">
                <th scope="col">Id</th>
                <th scope="col">Name</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((e, index) => (
                <tr key={index}>
                  <td>{e.id}</td>
                  <td>{e.name}</td>
                  <td>
                    <button onClick={() => deleteUser(e.id)}>Delete</button>
                    <button className="mx-3" onClick={() => editUser(e.id)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* {showDeleteConfirmation && (
                <div className="confirmation-modal">
                  <p>Are you sure you want to delete this user?</p>
                  <button onClick={confirmDelete}>Yes</button>
                  <button onClick={() => setShowDeleteConfirmation(false)}>
                    No
                  </button>
                </div>
              )} */}

        {showDeleteConfirmation && (
          <div
            className="modal show"
            tabIndex="-1"
            role="dialog"
            style={{ display: "block" }}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Confirmation</h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this user?</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-dismiss="modal"
                    onClick={() => setShowDeleteConfirmation(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
};

export default App;
