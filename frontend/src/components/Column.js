import React, { useState } from "react";
import Task from "./Task";
import TaskForm from "./TaskForm";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import { connect } from "react-redux";
import { editColumn, deleteColumn, fetchColumns } from "../actions";
import Icon from "@material-ui/core/Icon";
import { confirmAlert } from "react-confirm-alert";
import "./styles/react-confirm-alert.css";
import AllInclusiveIcon from "@material-ui/icons/AllInclusive";
import LimitError from "./LimitError";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";

const InfoIcon = styled(InfoOutlinedIcon)`
  margin-left: 10px;
  opacity: 0.5;
  cursor: text;
  &:hover {
    opacity: 0.8;
  }
`;

const ColumnContainer = styled.div`
  color: white;
  border: 1px solid rgba(1, 11, 15, 0.3);
  -webkit-box-shadow: 1px 1px 3px 1px rgba(1, 11, 15, 0.3);
  -moz-box-shadow: 1px 1px 3px 1px rgba(1, 11, 15, 0.3);
  box-shadow: 1px 1px 3px 1px rgba(1, 11, 15, 0.3);
  border-radius: 3px;
  background-color: rgba(0,0,0,0.1);
  width: 300px;
  height: 100%;
  margin-right: 12px;
  padding: 8px;

  &:active {
    border: 1px solid rgba(0, 0, 0);
    background-color: rgba(0,0,0,0.3)
    }

  &:hover {
    border: 1px solid rgba(0, 0, 0);
    background-color: rgba(0,0,0,0.2)
    }

  .
`;

const StyledInputTitle = styled.input`
  width: 80%;
  background-color: inherit;
  border: none;
  outline: none;
  border-bottom: 2px solid #03a8f45e;
  margin-bottom: 5px;
  margin-left: 23px;
  font-size: 1.4rem;
  text-align: center;
  padding: 5px;
  color: white;
`;

const StyledInputInfo = styled.input`
  width: 80%;
  background-color: inherit;
  border: none;
  outline: none;
  border-bottom: 2px solid #03a8f45e;
  margin-bottom: 5px;
  margin-right: 23px;
  font-size: 0.8rem;
  padding: 5px;
  color: white;
`;

const StyledInputLimit = styled.input`
  width: 8%;
  background-color: inherit;
  border: none;
  outline: none;
  border-bottom: 2px solid #03a8f45e;
  margin-bottom: 5px;
  margin-left: 0px;
  text-size: 1.4rem;
  text-align: center;
  padding: 5px;
  color: white;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled(Icon)`
  cursor: pointer;
  margin-left: 10px;
  opacity: 0.5;
  &:hover {
    opacity: 0.8;
  }
`;

const ColumnTitle = styled.h3`
  cursor: text;
  flex-grow: 2;
  text-transform: uppercase;
  &:hover {
    opacity: 0.5;
  }
`;

const Limit = styled.h3`
  margin-left: 10px;
  min-width: 24px;
  min-height: 28.8px;
  margin-bottom: 5px;
  margin-right: 10px;
  cursor: text;
  text-transform: uppercase;
  &:hover {
    opacity: 0.5;
  }
`;

const Line = styled.div`
  width: 96%;
  height: 1px;
`;

const Column = ({
  title,
  tasks,
  limit,
  id,
  index,
  indexX,
  indexY,
  dispatch,
  columns,
  info,
  color,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const renderEditInput = () => {
    return isEditingTitle ? (
      <form onSubmit={handleFinishEditing}>
        <StyledInputTitle
          onChange={handleChange}
          autoFocus
          placeholder={title}
          onFocus={handleFocus}
          onBlur={closeForm}
        />
      </form>
    ) : isEditingLimit ? (
      <form onSubmit={handleFinishEditing}>
        <StyledInputLimit
          onChange={handleChange}
          autoFocus
          onFocus={handleFocus}
          onBlur={closeForm}
        />
      </form>
    ) : (
      <form onSubmit={handleFinishEditing}>
        <StyledInputInfo
          style={{ width: "285px" }}
          onChange={handleChange}
          autoFocus
          placeholder={info}
          onFocus={handleFocus}
          onBlur={closeForm}
        />
      </form>
    );
  };

  const closeForm = () => {
    setIsEditingTitle(false);
    setIsEditingLimit(false);
    setIsEditingInfo(false);
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (isEditingTitle) title = e.target.value;
    if (isEditingLimit) limit = e.target.value;
    if (isEditingInfo) info = e.target.value;
  };

  const handleFinishEditing = () => {
    let validatedColumnLimit = limit;

    if (!/[0-9]/.test(validatedColumnLimit)) {
      validatedColumnLimit = -99999;
    }

    setIsEditingTitle(false);
    setIsEditingLimit(false);
    setIsEditingInfo(false);

    if (title.trim().length !== 0) {
      const column = {
        id,
        title: title,
        limit: validatedColumnLimit,
        info: info,
        tasks,
        index,
        indexX,
        indexY,
      };
      dispatch(editColumn(column));
    }
  };

  const handleDeleteColumn = () => {
    const swimlanesOfColumn = columns.filter(
      (column) => column.indexX === indexX
    );
    swimlanesOfColumn.forEach((column) => {
      dispatch(deleteColumn(column.id));
      dispatch(fetchColumns());
    });
  };

  const handleDeleteSwimlane = () => {
    const columnsOfSwimlane = columns.filter(
      (column) => column.indexY === indexY
    );
    columnsOfSwimlane.forEach((column) => {
      dispatch(deleteColumn(column.id));
      dispatch(fetchColumns());
    });
  };

  const submitColumnDelete = () => {
    confirmAlert({
      title: "Alert!",
      message: "Are you sure you want to delete this column ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteColumn(),
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

  const submitSwimlaneDelete = () => {
    confirmAlert({
      title: "Alert!",
      message: "Are you sure you want to delete this swimlane ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDeleteSwimlane(),
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
    <div>
      <Line style={{ backgroundColor: color }} />
      <ColumnContainer>
        {isEditingTitle || isEditingLimit || isEditingInfo ? (
          renderEditInput()
        ) : (
          <TitleContainer>
            {indexY === 0 || indexX === 0 ? null : (
              <Limit onClick={() => setIsEditingLimit(true)}>
                {limit <= -9999 ? (
                  <AllInclusiveIcon />
                ) : limit <= 0 ? (
                  <LimitError />
                ) : (
                  limit
                )}
              </Limit>
            )}

            {indexY > 0 && indexX > 0 ? null : (
              <ColumnTitle onClick={() => setIsEditingTitle(true)}>
                {title}
              </ColumnTitle>
            )}

            {indexY === 0 && indexX > 0 ? (
              <Tooltip title={info} interactive arrow>
                <InfoIcon onClick={() => setIsEditingInfo(true)} />
              </Tooltip>
            ) : null}

            {(indexY > 0 && indexX > 0) ||
            (indexX === 0 && indexY === 0) ? null : indexY === 0 ? (
              <DeleteButton onClick={submitColumnDelete}>delete</DeleteButton>
            ) : (
              <DeleteButton onClick={submitSwimlaneDelete}>delete</DeleteButton>
            )}

            {indexY === 0 || indexX === 0 ? null : isVisible ? (
              <VisibilityIcon
                style={{ cursor: "pointer" }}
                onClick={() => setIsVisible(false)}
              />
            ) : (
              <VisibilityOffIcon
                style={{ cursor: "pointer" }}
                onClick={() => setIsVisible(true)}
              />
            )}
          </TitleContainer>
        )}
        {indexY === 0 || indexX === 0 ? null : isVisible ? (
          <Droppable droppableId={id}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Task
                    id={task.id}
                    index={index}
                    key={task.id}
                    content={task.content}
                    columnID={task.columnID}
                    priority={task.priority}
                    users={task.users}
                    progress={task.progress}
                    color={task.color}
                    isLocked={task.isLocked}
                  />
                ))}
                {provided.placeholder}
                <TaskForm columnID={id} />
              </div>
            )}
          </Droppable>
        ) : null}
      </ColumnContainer>
    </div>
  );
};

const mapStateToProps = (state) => ({
  columns: state.columns,
});

export default connect(mapStateToProps)(Column);
