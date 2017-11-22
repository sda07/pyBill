from bs4 import BeautifulSoup as soup
import urllib2 as url

uri="https://book.airindia.in/itd/itd/lang/en/travel/quotes?journeyCount=2&search=SMART&calendarDate0=2018-01-01&calendarDate1=2018-01-02&calendarWindow=P3D&departDate0=2018-01-01&departLocation0=Airport.CCU&arriveLocation0=Airport.IXZ&departDate1=2018-01-02&departLocation1=Airport.IXZ&arriveLocation1=Airport.CCU&numInfants=0&numAdults=1&numChildren=0&fareClass=Economy&concessionaryTravellers=false&step=Search"
soupfile=url.urlopen(uri)
content = soupfile.read()
bs=soup(content, "html.parser")
soupfile.close()
jdate = bs.find_all("div", class_="caldata calfare")

for i in xrange(0,len(jdate)):
	first_date = jdate[i].find("div", class_="calprice").get_text() + "  "
	first_date = first_date + jdate[i].find("div", class_="caldate").get_text()
	print (first_date)
	


