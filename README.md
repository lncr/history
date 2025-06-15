# 🏛️ History Comic Generator

**History Comic Generator** is a web platform that turns your historical text inputs into **visually engaging, historically accurate comic books**. Designed with education in mind, it aims to make learning history more interactive, fun, and memorable for students and history enthusiasts.

## ✨ How It Works

1. **User Input**: The user enters a historical topic or story (e.g., *"Alexander the Great"*).
2. **Script Generation**: We craft a prompt for the GPT-4o model to generate a comic book script based on the input.
3. **Script Breakdown**: The resulting script is split into multiple smaller prompts — each one describing a **single comic book page**.
4. **Image Generation**: These page-level prompts are then sent one by one to the `gpt-image-1` model to generate corresponding illustrations.
5. **Comic Viewer**: The generated images are displayed in a carousel view on the webpage, creating a complete comic book experience.

## 🔧 Tools We Used

- 🧠 **ChatGPT** – to help us brainstorm and generate the initial Product Requirements Document (PRD).
- 🎨 **v0.dev** – to design the UI and layout of the platform.
- 💻 **Replit** – to collaborate and write all the frontend and backend code online.

## 📚 Why We Built It

We believe history should be exciting—not boring. By combining storytelling, art, and AI, we want to create an educational experience that’s both **instructive and fun**.
