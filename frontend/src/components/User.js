import React from "react";
import { connect } from "react-redux";
import { Draggable } from "react-beautiful-dnd";
import Avatar from "@material-ui/core/Avatar";
import styled from "styled-components";
import CloseIcon from '@material-ui/icons/Close';
import { confirmAlert } from "react-confirm-alert";
import "./styles/react-confirm-alert.css";
import { deleteUser } from '../actions/userActions';
import { dragStateSave } from "../actions";

const UserBox = styled.div`
    position: relative;
    height: 35px;
    width: 35px;
`;

const SmallAvatar = styled(Avatar)`
  && {
    height: 30px;
    width: 30px;
    margin-right: 10cdpx;
    border: 1px solid black;
    font-weight: 500;
  }
`;

const SmallCloseIcon = styled(CloseIcon)`
  && {
    position: absolute;
    display: none;
    top: -5px;
    right: -4px;
    color: white;
    height: 12px;
    width: 12px;
    opacity: 0.8;
    ${UserBox}:hover & {
        display: block;
        cursor: pointer;
    }
  }
`;

const User = ({ _id, name, index, color, isDragDisabled, dispatch, columns}) => {

  const handleDeleteUser = () => {
    dispatch(deleteUser(_id));
    const deleteUserState = columns;
    deleteUserState.map(column => {
      column.tasks.map(task => {
        task.users = task.users.filter(user => user._id !== _id)
        return task;
      })
      return column;
    })
    dispatch(dragStateSave(deleteUserState))
  }

  
  
  const submitDeleteUser = () => {
    confirmAlert({
      title: "Alert!",
      message: "Are you sure you want to delete this user ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteUser(),
        },
        {
          label: "No",
          onClick: () => {
            return null;
          },
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });

  };
  return (
    <Draggable draggableId={_id} index={index} type="user" isDragDisabled={isDragDisabled}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
            <UserBox>
            <SmallCloseIcon onClick={submitDeleteUser}/>
          <SmallAvatar style={{ backgroundColor: color }} title={name}>
            {name[0].toUpperCase()}
          </SmallAvatar>
          </UserBox>
        </div>
      )}
    </Draggable>
  );
};

const mapStateToProps = state => ({
  columns: state.columns
})

export default connect(mapStateToProps)(User);