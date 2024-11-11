# Stage 1: Build stage (dependencies)
FROM python:3.10-slim AS build

WORKDIR /app

# Copy the requirements file
COPY req.txt .

# Install dependencies in a separate directory to avoid clutter in the final image
RUN pip install --user --no-cache-dir -r req.txt

# Stage 2: Runtime stage (lighter final image)
FROM python:3.10-slim

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /root/.local /root/.local

# Copy the source code into the final image
COPY . .

# Ensure the installed Python packages are accessible
ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
