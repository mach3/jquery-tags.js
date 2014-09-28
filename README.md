
# Tags.js

User interface to input tags.

## Features

- Automatically render list of tags, suggestion items, named hidden input element
- Set default tags
- Show suggestions by specifying items
- Select one from suggested and add the tag by clicking the item
- Select suggested item by Tab/Shift+Tab, Up/Down key,
  then press Enter key to add the tag

## Usage

	<input type="text" name="tags" id="tags">

	<script>
	$("tags").tags({
		tags: ["foo", "bar", "baz"], // default tags
		suggests: [ // suggest items
			"Google Chrome",
			"Mozilla Firefox",
			"Microsoft Internet Explorer",
			"Safari",
			"Opera"
		]
	});
	</script>

## Available Options

	{
		// {String} Separate string
		delimiter: ",", 
		// {String} Container for tag list (selector expression)
		nodeTagsContainer: null, 
		// {Array|String} Default tags, array or separated string
		tags: null, 
		// {Array} Suggest items
		suggests: null, 
		// {Number} Limit count to show suggest items
		suggestsLimit: 5, 
		// {String} className for tag list
		classList: "js-tags-list", 
		// {String} className for label in tag list
		classLabel: "js-tags-label", 
		// {String} className for remove button in tag list
		classRemove: "js-tags-button-remove", 
		// {String} className for suggests
		classSuggest: "js-tags-suggest", 
		// {String} className for items in suggests
		classSuggestItem: "js-tags-suggest-item" 
	}
