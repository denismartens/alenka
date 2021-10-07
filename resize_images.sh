#!/bin/bash

set -e

use_tmp_dir=false
force=false
dry_run=false
download=true
resize=true
upload=true

get_usage()
{
cat << EOF
Script to support resizing images and syncing to/from AWS S3 bucket

where:
		-h | --help 	   show this help text
		-f | --force	   force generate images of all sizes, overwriting existing ones)
		     --dry-run     show what will be done
		     --download    only download from S3 bucket
		     --resize      only resize local images
		     --upload      only upload to S3 bucket
EOF
}

while [ $# -gt 0 ] ; do
	case $1 in
		-h | --help) get_usage; exit 0 ;;
		-f | --force) force=true ;;
		     --dry-run) dry_run=true ;;
		     --download) resize=false; upload=false ;;
		     --upload) download=false; resize=false ;;
		     --resize) download=false; upload=false ;;
	esac
	shift
done

cleanup() {
	if [[ $use_tmp_dir = true ]]; then
		rm -rf $LOCAL_BUCKET_DIR
	fi
}

trap cleanup INT TERM HUP

sync_from_bucket() {
	if [[ -z $BUCKET_PREFIX ]]; then
		echo 'Error: BUCKET_PREFIX is required'
		exit 1
	elif [[ -z $LOCAL_BUCKET_DIR ]]; then
		use_tmp_dir=true
		LOCAL_BUCKET_DIR="/tmp/$RANDOM"
		echo "LOCAL_BUCKET_DIR not provided, using temporary dir $LOCAL_BUCKET_DIR"
	fi
	cmd="aws s3 sync s3://$BUCKET_PREFIX $LOCAL_BUCKET_DIR"
	if [[ $dry_run = true ]]; then
		echo "to run: $cmd"
		return
	fi
	eval $cmd
}

sync_to_bucket() {
	if [[ -z $BUCKET_PREFIX ]]; then
		echo 'Error: BUCKET_PREFIX is required'
		exit 1
	elif [[ -z $LOCAL_BUCKET_DIR ]]; then
		echo 'Error: LOCAL_BUCKET_DIR is required'
		exit 1
	fi
	cmd="aws s3 sync $LOCAL_BUCKET_DIR s3://$BUCKET_PREFIX"
	if [[ $dry_run = true ]]; then
		echo "to run: $cmd"
		return
	fi
	eval $cmd
}

resize_images() {
	if [[ -z $LOCAL_BUCKET_DIR ]]; then
		echo 'Error: LOCAL_BUCKET_DIR is required'
		exit 1
	fi
	declare -A sizes
	sizes[md]='1000'
	sizes[sm]='800'
	sizes[xs]='600'
	declare -A tl_sizes
	tl_sizes[lg]='600'
	tl_sizes[md]='400'
	tl_sizes[sm]='200'
	tl_sizes[xs]='100'
	find $LOCAL_BUCKET_DIR -type f -wholename */lg/* -print0 |
	while IFS= read -r -d '' lg_img; do
		for size in ${!sizes[@]}; do
			new_img=${lg_img/\/lg\//\/$size\/}
			if [[ -f $new_img ]] && [[ $force = false ]]; then
				# echo "image $new_img already exists"
				continue
			fi
			cmd="magick convert \"$lg_img\" -verbose -resize ${sizes[$size]} \"$new_img\""
			if [[ $dry_run = true ]]; then
				echo "to run: $cmd"
				continue
			fi
			mkdir -p $(dirname $new_img)
			eval $cmd
		done
		for tl_size in ${!tl_sizes[@]}; do
			new_img=${lg_img/\/lg\//\/tl-$tl_size\/}
			if [[ -f $new_img ]] && [[ $force = false ]]; then
				# echo "image $new_img already exists"
				continue
			fi
			cmd="magick convert \"$lg_img\" -verbose -thumbnail ${tl_sizes[$tl_size]} \"$new_img\""
			if [[ $dry_run = true ]]; then
				echo "to run: $cmd"
				continue
			fi
			mkdir -p $(dirname $new_img)
			eval $cmd
		done
	done
}

if [[ $download = true ]]; then
	sync_from_bucket
fi
if [[ $resize = true ]]; then
	resize_images
fi
if [[ $upload = true ]]; then
	sync_to_bucket
fi
