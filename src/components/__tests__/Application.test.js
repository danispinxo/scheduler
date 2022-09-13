import React from "react";
import { render, cleanup, waitForElement, fireEvent, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";
import Application from "components/Application";
import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
  
    await waitForElement(() => getByText("Monday"));
  
    fireEvent.click(getByText("Tuesday"));
  
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving...")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /no spots remaining/)).toBeInTheDocument();
  
  });

  it("loads data, deletes an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until a spot with a full interview is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    // 3. Click the "Delete" button on the first full appointment, which is the second appointment on the screen with the name 'Archie Cohen'.
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the Confirm screen appears
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirm screen
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting..." is displayed
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // 7. Wait until the empty appointment is displayed.
    await waitForElement(() => getByText(appointment, "1pm"));
    // 8. Check that the DayList Item with the text Monday has 2 spots.
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /2 spots remaining/)).toBeInTheDocument();

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until a spot with a full interview is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];

    // 3. Click the "Edit" button on the first full appointment, which is the second appointment on the screen with the name 'Archie Cohen'.
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Check that the Edit screen appears
    expect(getByText(appointment, "Cancel")).toBeInTheDocument();

    // 5. Change the value of the name to "Karma Pajuaar"
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Karma Pajuaar" }
    });

    // 6. Click the Save button
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that the element with the text "Saving..." is displayed
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 7. Wait until the edited appointment is displayed.
    await waitForElement(() => getByText(appointment, "Karma Pajuaar"));

    // 8. Check that the DayList Item with the text Monday still has 1 spot.
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/)).toBeInTheDocument();

  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    // 2. Click on Add for the first appointment
    fireEvent.click(getByAltText(appointment, "Add"));

    // 3. Enter a name to avoid an incomplete data error
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Jesse Pajuaar" }
    });

    // 4. Select an interviewer to avoid an incomplete data error
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 5. Click the Save button
    fireEvent.click(getByText(appointment, "Save"));

    // 6. Check that the loading screen appears
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 7. Mock a rejected put request

    await waitForElement(() => getByText(appointment, "Could not save appointment."));

    // 8. Check that the unable to save error message appears 
    expect(getByText(appointment, "Could not save appointment.")).toBeInTheDocument();

    // 9. Click the X Button
    fireEvent.click(getByAltText(appointment, "Close"));

    // 10. Check that the new name does not appear in the document
    expect(queryByText(appointment, "Jesse Pajuaar")).toBeNull();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until a spot with a full interview is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[1];
    
    // 3. Click the "Delete" button on the first full appointment, which is the second appointment on the screen with the name 'Archie Cohen'.
    fireEvent.click(getByAltText(appointment, "Delete"));
    
    // 4. Check that the Confirm screen appears
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
    
    // 5. Click the "Confirm" button on the confirm screen
    fireEvent.click(getByText(appointment, "Confirm"));
    
    // 6. Check that the element with the text "Deleting..." is displayed
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // 7. Mock a rejected delete request
    await waitForElement(() => getByText(appointment, "Error"));

    // 8. Check that the unable to delete error message appears
    expect(getByText(appointment, "Could not delete appointment.")).toBeInTheDocument();

    // 9. Click the X to close
    fireEvent.click(getByAltText(appointment, "Close"));
    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/)).toBeInTheDocument();

  });
})
