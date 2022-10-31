#make a list of streets in karlsruhe
import time
streets= [
    "Marktplatz",
    "Marktstraße",
    "Neckarstraße",
    "Neutorstraße",
    "Ostendstraße",
    "Rathausstraße",
    "Rosenstraße",
    "Schlossplatz",
    "Schlossstraße",
 
]

#convert the above streets into coordinates using geopy
from geopy.geocoders import Nominatim
geolocator = Nominatim(user_agent="my-alication")
locations = []
for street in streets:
    #add wait time to avoid overloading the server
    time.sleep(3)
    location = geolocator.geocode(street + ", Karlsruhe, Germany")
    locations.append(location)

#convert the above coordinates into a dataframe
import pandas as pd
df = pd.DataFrame(locations)
df

#convert the above dataframe into a csv file
df.to_csv('C:\\Users\\binda\\Downloads\\streets.csv')

