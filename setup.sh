# check installations

# check if docker is installed
if ! command -v docker &> /dev/null
then
    echo "please install docker"
else
    echo "docker is installed"
fi

# nextjs installations
# check nvm and corepack
if ! command -v nvm &> /dev/null || ! command -v corepack &> /dev/null
then
    echo "please install nvm and corepack"
else
    echo "nvm and corepack are installed"

    echo "setting up nvm and pnpm"
    cd food-match
    nvm use

    corepack prepare --activate
    pnpm i
    cd ..
fi

# ml-service installations
# check python3 and venv
if command -v python3 &> /dev/null; then
    if python3 -m venv -h &> /dev/null; then
        echo "python3 and venv are available."
        cd ml-service
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
        cd ..
    else
        echo "venv module is not available."
    fi
else
    echo "python3 is not installed."
fi
