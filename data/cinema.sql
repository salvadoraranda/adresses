SELECT idthing,name,infourl,
st_x(thing_position),
st_y(thing_position),
st_x(st_transform(thing_position,4326)) as lon,
st_y(st_transform(thing_position,4326)) as lat,
st_asgeojson(thing_position)
FROM goeland_thing WHERE idtypething =78