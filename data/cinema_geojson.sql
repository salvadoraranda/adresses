SELECT row_to_json(fc)
 FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features
        FROM ( SELECT
                   'Feature'                        AS TYPE,
                   ST_AsGeoJSON(lg.thing_position, 6) :: JSON AS GEOMETRY,
                  row_to_json((SELECT l
                               FROM (SELECT
                                       idthing,
                                       name,
                                       infourl,
                                       st_x(thing_position) as x,
                                       st_y(thing_position) as y,
                                       st_x(st_transform(thing_position,4326)) as lon,
                                       st_y(st_transform(thing_position,4326)) as lat
                                     ) AS l
                              ))                   AS properties
                FROM goeland_thing as lg
		        WHERE idtypething =78
		)as f
) as fc

