const Listing = require("../models/listings");

// index route
module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
};

// new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// new listing - POST
module.exports.newListing = async (req, res) => {
  console.log(req.file);
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New listing created!");
  res.redirect("/listings");
};

// show route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  const location = listing.location;
  const coords_res = await fetch(
    `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
      location
    )}.json?key=9AM7JDY39qjYqwRo9USwEN8QDRHlv38f`
  );
  const coords = await coords_res.json();
  const { lat, lon } = coords.results[0].position;
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, lat, lon });
};

// edit route
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// delete route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};

// update route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};
