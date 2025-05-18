# kanbanFlow, a Vue.js Kanban Board with Drag & Drop and Pomodoro Timer

A lightweight, interactive Kanban board application built with Vue.js 3 and Tailwind CSS with built-in Pomodoro timer functionality to help you organize tasks and boost productivity.

## Kanban Features

- **Multiple Columns**
  - Default columns: To Do, Doing, Done
  - Custom columns with unique colors

- **Column and Task Management**
  - Add, remove, and rename both tasks and columns to fit your workflow
  - Move tasks between columns

- **Drag & Drop**
  - Intuitively move tasks between columns with a simple drag and drop
  - Drop tasks on the "Doing" column to start a Pomodoro timer
  - Drop tasks on the "Done" column to mark them as completed

- **Pomodoro Integration**: 
  - Automatically start a Pomodoro timer when dragging tasks to the "Doing" column
  - Manually trigger timers by clicking the clock icon on any task


## Pomodoro Features

- **Multiple Timer Modes**
  - Work Session (25 minutes)
  - Short Break (5 minutes)
  - Long Break (15 minutes)

- **Full Control**
  - Start/Pause any session
  - Reset the current timer
  - Stop the current session
  - Switch between different timer modes (Work, Short Break, Long Break)

- **Session Tracking**
  - Counts completed work sessions
  - Automatically cycles between work and break sessions
  - Long break after every 4 work sessions


## Features to Add:

- Add a settings panel
- Add a dark mode
- Add ability to serve kanban and pomodoro data to a database
- Add ability to load kanban and pomodoro data from a database
-Analytics for kanban and pomodoro data


## About Kanban Boards

Kanban boards are a visual tool used to manage and prioritize tasks in a project. They are based on the Kanban method, which was developed by Taiichi Ohno in the 1950s as a way to improve manufacturing efficiency. The Kanban board is a visual representation of the workflow, with columns representing different stages of the project and cards representing individual tasks. The goal is to visualize the workflow and identify bottlenecks, allowing for better planning and resource allocation.

### The Basic Process:

1. Create a Kanban board with columns for different stages of the project (e.g., To Do, Doing, Done)
2. Add cards to the board to represent individual tasks
3. Move cards between columns to represent the progress of the project
4. Use the board to prioritize tasks and identify bottlenecks

## About the Pomodoro Technique

The Pomodoro Technique is a time management method developed by Francesco Cirillo in the late 1980s. The technique uses a timer to break down work into intervals, traditionally 25 minutes in length, separated by short breaks. Each interval is known as a "pomodoro," from the Italian word for tomato, after the tomato-shaped kitchen timer that Cirillo used as a university student.

### The Basic Process:
1. Decide on the task to be done
2. Set the pomodoro timer (typically for 25 minutes)
3. Work on the task until the timer rings
4. Take a short break (5 minutes)
5. After every four pomodoros, take a longer break (15-30 minutes)
