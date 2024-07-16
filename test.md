Sure, here's a step-by-step procedure to build a website and assign a theme using GitHub:

### Prerequisites
1. **GitHub Account**: Make sure you have a GitHub account.
2. **Git**: Install Git on your local machine if not already installed.
3. **Text Editor**: Have a text editor installed, such as Visual Studio Code, Sublime Text, or Atom.

### Step-by-Step Guide

#### 1. Create a Repository on GitHub
1. Log in to your GitHub account.
2. Click on the **+** icon in the top-right corner and select **New repository**.
3. Enter a repository name (e.g., `my-website`).
4. Optionally, add a description.
5. Choose the visibility (public or private).
6. Check the box to initialize the repository with a README file.
7. Click **Create repository**.

#### 2. Clone the Repository to Your Local Machine
1. Open Git Bash or your terminal.
2. Navigate to the directory where you want to clone the repository:
    ```sh
    cd path/to/your/directory
    ```
3. Clone the repository:
    ```sh
    git clone https://github.com/your-username/my-website.git
    ```
4. Navigate into the cloned repository:
    ```sh
    cd my-website
    ```

#### 3. Create the Website Files
1. Open your text editor and navigate to the cloned repository folder.
2. Create the main HTML file (e.g., `index.html`):
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Website</title>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <h1>Welcome to My Website</h1>
        <p>This is a simple website.</p>
    </body>
    </html>
    ```
3. Create a CSS file (e.g., `styles.css`):
    ```css
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        text-align: center;
        background-color: #f4f4f4;
    }

    h1 {
        color: #333;
    }
    ```

#### 4. Add and Commit Changes
1. Add the new files to the repository:
    ```sh
    git add index.html styles.css
    ```
2. Commit the changes with a message:
    ```sh
    git commit -m "Initial commit with basic website structure"
    ```

#### 5. Push Changes to GitHub
1. Push the committed changes to GitHub:
    ```sh
    git push origin main
    ```

#### 6. Set Up GitHub Pages
1. Go to your repository on GitHub.
2. Click on the **Settings** tab.
3. Scroll down to the **GitHub Pages** section.
4. Under **Source**, select the branch (e.g., `main`) and folder (e.g., `/root`).
5. Click **Save**.
6. Your site should now be published at `https://your-username.github.io/my-website/`.

#### 7. Assign a Theme (Optional)
You can use a Jekyll theme to style your website more attractively.
1. In the root of your repository, create a `_config.yml` file.
2. Add the following content to the `_config.yml` file to apply a theme (e.g., `minima`):
    ```yaml
    theme: minima
    ```
3. Commit and push the changes:
    ```sh
    git add _config.yml
    git commit -m "Add Jekyll theme"
    git push origin main
    ```

#### 8. Customize Your Theme (Optional)
1. To customize the theme, you can override the default theme's styles and layouts by creating the respective files in your repository.
2. For example, create a `_layouts` directory and add a `default.html` file to customize the layout.

### Additional Tips
- Regularly commit and push your changes to keep your repository up-to-date.
- You can explore other Jekyll themes at [Jekyll Themes](https://jekyllrb.com/docs/themes/) and follow their specific instructions to apply them.
- If you prefer using static site generators other than Jekyll, you can explore options like Hugo, Gatsby, or Next.js.

Following these steps, you can build a basic website, host it on GitHub Pages, and assign a theme to style it.
