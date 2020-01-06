const fs = require("fs")
const path = require("path")
const util = require("util")
const areaddir = util.promisify(fs.readdir);
const moment = require('moment')

module.exports = async (galleryPath, date) => {
	const today = date.toDateString("en-US")
	const todayFormatted = moment(date).format('Y-MM-DD')

	const isRangeFolder = folder => new RegExp(/^\d{4},\d{4}-\d{2},\d{2}-\d{2},\d{2}$/).test(folder)

	const rangeWithin = (folder, date) => {
		console.log('date is, ', date)
		date = new Date(date.setYear(1900))
		const d = folder.match(/^(\d{4}),(\d{4})-(\d{2}),(\d{2})-(\d{2}),(\d{2})$/).slice(1)
		const dateBegin = moment(`1900-${d[2]}-${d[4]}`)
		const dateEnd = moment(`1900-${d[3]}-${d[5]}`)

		console.log('checking if', moment(date), ' is within ', dateBegin, 'and' ,dateEnd)
		return moment(date).isBetween(dateBegin, dateEnd)
	}

	const suitableFolders = (carry, current) => {
		if(current == todayFormatted) carry.push(current)
		if(isRangeFolder(current) && rangeWithin(current, date)) carry.push(current)
		return carry
	}

	const suitableImages = async (carry, current) => { 
		carry = await carry
		const images = await areaddir(path.join(galleryPath, current))
		const imagePaths = images.map( image => path.join(galleryPath, current, image))
		return carry.concat(imagePaths)
	}

	const availableFolders = await areaddir(galleryPath)
	const useableFolders = availableFolders.reduce(suitableFolders, [])
	const images = await useableFolders.reduce(suitableImages, [])
	return images
}