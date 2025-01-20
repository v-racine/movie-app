FROM node

# Create app directory
WORKDIR /app

# Copy package*.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app will listen on (e.g., 3000)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]