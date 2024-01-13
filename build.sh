npx terser src/src.js -o dist/dist.js -c -m
cat /dev/null > index.html
echo "<a href='javascript:\c" >> index.html
cat dist/dist.js >> index.html
echo "'>Cybertanks</a>" >> index.html