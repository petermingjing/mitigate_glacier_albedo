# glacier_albedo_factors
Monitor the trends of global glacier albedo using MODIS MOD10A1/MYD10A1 datasets, diagnose the causing factors (2-m air temperature, precipitation, and AOD), and propose mitigation strategies and protection measures to curb the global glaciers from being darkening.

Note

Variable daily values
 - region-based daily mean glacier albedo and global daily mean albedo derived from regional means
 - region-based daily mean 2-m air temperature (degree C)
 - region-based mean daily total precipitation (mm)
 - region-based daily mean aerosol optical depth (aod)


Region - Code (Upper or lower cases)
----
1. Alaska - ASK
2. WesternCanadaUS - WCUS
3. ArcticCanadaNorth - ACN
4. ArcticCanadaSouth - ACS
5. GreenlandPeriphery - GP
6. Iceland - ICE
7. Svalbard - SVA
8. Scandinavia - SAV
9. RussianArctic - RAC
10. NorthAsia - NA
11. CentralEurope - CE
12. CaucasusMiddleEast - CME
13. CentralAsia - CA
14. SouthAsiaWest - SAW
15. SouthAsiaEast - SAE
16. LowLatitudes - LOL
17. SouthernAndes - SAN
18. NewZealand - NZ
19. AntarcticSubantarctic - AS



Parameter code
----
Parameters used in this study include regional glacier albedo (unit %), 2-m air temperature (unit °C), total precipitation (unit mm), and aod on daily, monthly and yearly basis. Monthly precipitation is monthly accumulated precipitation. In the shared dataset, the parameters are presented as the combination of region code and variables. For example, in Alaska, regional albedo is "ask_albe", regional temperature is "ask_temp" or "ask_C", regional precipitation is "ask_precip" or "ask_C", and regional aod is "aod_ask" or "aod_r_ask", etc.



AOD
----
Because the MCD19A2 dataset provides no values above 4200 m and in real practice, we found blank areas in aod below 4000 m, we used handy-drawn areas adjecent to glacier outlines to calculate aod values as potential aerosol-infected area to specific glacier region. The detailed outlines of calculated regions refer to the .geojson files in the folder "aod_hand_drawing_regions", which can be openned and viewed in QGIS.