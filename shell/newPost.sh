## Get current date ##
_now=$(date +"%Y-%m-%d")

## Get uuid
_uuid=$(uuidgen)

## Get sample file's path
_sample_path="./sample/post/postSample.md"

## Get file name

## input category name
echo "Enter the category name: "
read _category_name

## make category name folder
mkdir ./_posts/$_category_name

## get file name
_file_name="./_posts/$_category_name/$_now-$_uuid.md"


## copy sample post
cp $_sample_path $_file_name

