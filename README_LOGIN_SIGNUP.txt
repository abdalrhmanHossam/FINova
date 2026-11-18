FiNova login/signup fix

This version does not submit the forms to PHP files.
Signup and login are handled in JavaScript and saved in browser localStorage under the key finovaUsers.

How to test:
1. Open the project with VS Code Live Server or any static server.
2. Open signup/index.html.
3. Create an account. The page will redirect to login.
4. Login with the same email and password.
5. You will go to dashboard/index.html.

Note: localStorage is only for a front-end demo. For a real website, use PHP/MySQL or another backend and never store plain passwords in the browser.
