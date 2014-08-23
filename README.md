NeedToPee
==================

NeedToPee is a website for finding the nearest bathroom when you really, really need it.

Product development is managed on a private Trello Board available here: https://trello.com/b/kxg2wiJv/pee

The site is hosted on Github Pages and is available at http://NeedToPee.me. Master is used as a development branch, the gh-pages branch represents what is currently in production.


Coverage
==================

NeedToPee currently only supports public bathrooms administered by the Wellington City Council in the Wellington region.


Location Data
==================

Location data should be provided in, or converted to a json array of locations. A location is a json object (described below) which must include a set of gps coordinates and may include a series of properties describing the facility which will be displayed directly to the user. All properties are optional but recommended.

    {
      'type' : 'Toilet'
      'geometry' : {
        'type' : 'Point'
        'coordinates' : [{gps_x_coordinate}, {gps_y_coordinate}]
        'properties' : {
          'Open_hours' : '24 Hours'      // The facilities open hours, no format specified
          'Disabled' : 'Yes'             // Are facilities for disabled persons are available at this location? Yes or No
          'Suburb' : 'Wadestown'
          'Location' : 'Wadestown Road'  // Additional location details
          'Type' : 'Unisex'              // Other possible values: Male, Female
          'Change_room' : 'Yes'          // Are baby changing facilities available at this location? Yes or No
        }
      }
    }


Contributors
==================

NeedToPee was originally created at Startup Weekend Wellington in February 2014 by:

- Christina Houlihan
- Cayla Were
- Matthew Gray
- Gina Marie Stevens
- Seno Sulharyadi
- Ken Kopelson
- Michael Dowse
