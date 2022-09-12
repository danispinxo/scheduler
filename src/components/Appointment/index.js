import React from "react";
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import useVisualMode from "hooks/useVisualMode";
import Confirm from "./Confirm";

export default function Appointment(props) {
  const { id, time, interview, interviewers, onDelete } = props;
  const EMPTY = 'EMPTY';
  const SHOW = 'SHOW';
  const CREATE = 'CREATE';
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';
  const CONFIRM = 'CONFIRM';
  const EDIT = 'EDIT';

  const { mode, transition, back } = useVisualMode(
    interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(id, interview)
      .then(() => {
        transition(SHOW);
      })
  }

  function confirmDelete() {
    transition(CONFIRM);
  }

  function deleteInterview() {
    transition(DELETING);
    onDelete(id)
      .then(() => {
        console.log("Deleting");
        transition(EMPTY);
      });
  }

  function onEdit() {
    transition(EDIT)
  }

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}

      {mode === CONFIRM && (
        <Confirm 
          message={"Are you sure you would like to delete?"}
          onCancel={() => back()} 
          onConfirm={() => deleteInterview()}
        />)}
      {mode === DELETING && <Status message="Deleting..." />}

      {mode === SHOW && interview && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={() => confirmDelete()}
          onEdit={() => onEdit()}
        />
      )}

      {mode === CREATE && (
        <Form
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />)}
      {mode === EDIT && (
        <Form
          student={interview.student}
          interviewer={interview.interviewer.id}
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && <Status message="Saving..."/>}
    </article>
  );
}