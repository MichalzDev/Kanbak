import React, { useState } from "react";
import Task from "./Task";
import Create from "./Create";
import { Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { connect } from "react-redux";
import { editColumnTitle, deleteColumn } from "../actions";
import Icon from "@material-ui/core/Icon";
import Limit from "./Limit";

const ColumnContainer = styled.div`
  background-color: #ff8948;
  border-radius: 3px;
  width: 300px;
  padding: 8px;
  height: 100%;
  margin-right: 8px;
`;

const StyledInput = styled.input`
  width: 96%;
  border: none;
  outline-color: #ff8948;
  border-radius: 3px;
  margin-bottom: 3px;
  padding: 5px;
`;

const TitleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DeleteButton = styled(Icon)`
  cursor: pointer;
  margin-left: 5px;
  opacity: 0.5;
  &:hover {
    opacity: 0.8;
  }
`;

const ColumnTitle = styled.h4`
  cursor: text;
  text-transform: uppercase;
  &:hover {
    opacity: 0.5;
  }
`;

const ColumnList = ({ title, tasks, id, index, dispatch }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState(title);

  const renderEditInput = () => {
    return (
      <form onSubmit={handleFinishEditing}>
        <StyledInput
          type="text"
          value={columnTitle}
          onChange={handleChange}
          autoFocus
          onFocus={handleFocus}
          onBlur={handleFinishEditing}
        />
      </form>
    );
  };

  const handleFocus = e => {
    e.target.select();
  };

  const handleChange = e => {
    e.preventDefault();
    setColumnTitle(e.target.value);
  };

  const handleFinishEditing = e => {
    setIsEditing(false);
    dispatch(editColumnTitle(id, columnTitle));
  };

  const handleDeleteColumn = () => {
    dispatch(deleteColumn(id));
  };

  return (
    <Draggable key={id} draggableId={id} index={index}>
      {provided => (
        <ColumnContainer
          {...provided.draggableProps}
          ref={provided.innerRef}
          {...provided.dragHandleProps}
        >
          <Limit tasks={tasks} />
          {isEditing ? (
            renderEditInput()
          ) : (
            <TitleContainer>
              <ColumnTitle onClick={() => setIsEditing(true)}>
                {columnTitle}
              </ColumnTitle>
              <DeleteButton onClick={handleDeleteColumn}>delete</DeleteButton>
            </TitleContainer>
          )}
          <Droppable droppableId={id}>
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {tasks.map((task, index) => (
                  <Task
                    id={task.id}
                    index={index}
                    key={task.id}
                    content={task.content}
                    columnID={task.columnID}
                  />
                ))}
                {provided.placeholder}
                <Create columnID={id} />
              </div>
            )}
          </Droppable>
        </ColumnContainer>
      )}
    </Draggable>
  );
};

export default connect()(ColumnList);
