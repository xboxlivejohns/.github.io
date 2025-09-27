// Complete UK Vehicle Database - Replace the vehicleDatabase object in your booking system with this
// Audit note: currently covers 22 manufacturers. Frequently requested marques that are not yet
// represented include Citroën, Fiat, Alfa Romeo, Lexus, Mitsubishi, Suzuki, Jeep, Porsche, Cupra,
// Polestar, MG, DS Automobiles and Genesis.
const vehicleDatabase = {
    "Ford": {
        "Fiesta": {
            "2017-2023": { length: 4040, width: 1735, height: 1476, category: "Small Car" },
            "2008-2017": { length: 3950, width: 1722, height: 1468, category: "Small Car" }
        },
        "Focus": {
            "2018-2023": { length: 4378, width: 1825, height: 1471, category: "Medium Car" },
            "2011-2018": { length: 4368, width: 1823, height: 1484, category: "Medium Car" }
        },
        "Mondeo": {
            "2014-2022": { length: 4871, width: 1852, height: 1482, category: "Large Car" }
        },
        "Kuga": {
            "2019-2023": { length: 4613, width: 1882, height: 1658, category: "SUV" },
            "2013-2019": { length: 4524, width: 1838, height: 1689, category: "SUV" }
        },
        "EcoSport": {
            "2013-2023": { length: 4096, width: 1765, height: 1653, category: "Small SUV" }
        },
        "Puma": {
            "2019-2023": { length: 4186, width: 1805, height: 1537, category: "Small SUV" }
        },
        "Edge": {
            "2015-2020": { length: 4804, width: 1928, height: 1702, category: "Large SUV" }
        },
        "Transit Custom": {
            "2012-2023": { length: 4972, width: 1993, height: 1861, category: "Medium Van" }
        },
        "Transit Connect": {
            "2013-2023": { length: 4418, width: 1835, height: 1826, category: "Small Van" }
        },
        "Transit": {
            "2014-2023": { length: 5531, width: 2032, height: 1979, category: "Large Van" }
        },
        "Ranger": {
            "2019-2023": { length: 5359, width: 1860, height: 1848, category: "Pickup" }
        }
    },
    "Vauxhall": {
        "Corsa": {
            "2019-2023": { length: 4060, width: 1765, height: 1435, category: "Small Car" },
            "2014-2019": { length: 4021, width: 1736, height: 1510, category: "Small Car" },
            "2006-2014": { length: 4021, width: 1736, height: 1504, category: "Small Car" }
        },
        "Astra": {
            "2021-2023": { length: 4374, width: 1860, height: 1470, category: "Medium Car" },
            "2015-2021": { length: 4370, width: 1809, height: 1484, category: "Medium Car" },
            "2009-2015": { length: 4419, width: 1814, height: 1510, category: "Medium Car" }
        },
        "Insignia": {
            "2017-2023": { length: 4986, width: 1863, height: 1456, category: "Large Car" },
            "2008-2017": { length: 4910, width: 1856, height: 1498, category: "Large Car" }
        },
        "Crossland": {
            "2017-2023": { length: 4212, width: 1765, height: 1605, category: "Small SUV" }
        },
        "Mokka": {
            "2020-2023": { length: 4151, width: 1791, height: 1534, category: "Small SUV" },
            "2012-2019": { length: 4281, width: 1809, height: 1665, category: "Small SUV" }
        },
        "Grandland": {
            "2017-2023": { length: 4477, width: 1844, height: 1609, category: "SUV" }
        },
        "Antara": {
            "2006-2015": { length: 4569, width: 1850, height: 1684, category: "SUV" }
        },
        "Combo": {
            "2018-2023": { length: 4403, width: 1848, height: 1814, category: "Small Van" }
        },
        "Vivaro": {
            "2019-2023": { length: 4959, width: 1956, height: 1890, category: "Medium Van" },
            "2014-2019": { length: 4999, width: 1956, height: 1890, category: "Medium Van" }
        }
    },
    "Volkswagen": {
        "Up!": {
            "2011-2023": { length: 3540, width: 1641, height: 1489, category: "Small Car" }
        },
        "Polo": {
            "2017-2023": { length: 4053, width: 1751, height: 1446, category: "Small Car" },
            "2009-2017": { length: 3970, width: 1682, height: 1453, category: "Small Car" }
        },
        "Golf": {
            "2019-2023": { length: 4284, width: 1789, height: 1456, category: "Medium Car" },
            "2012-2019": { length: 4255, width: 1799, height: 1442, category: "Medium Car" },
            "2008-2012": { length: 4199, width: 1786, height: 1479, category: "Medium Car" }
        },
        "Jetta": {
            "2018-2023": { length: 4659, width: 1778, height: 1453, category: "Large Car" }
        },
        "Passat": {
            "2014-2023": { length: 4767, width: 1832, height: 1456, category: "Large Car" },
            "2010-2014": { length: 4868, width: 1836, height: 1456, category: "Large Car" }
        },
        "Arteon": {
            "2017-2023": { length: 4862, width: 1871, height: 1427, category: "Large Car" }
        },
        "T-Cross": {
            "2019-2023": { length: 4108, width: 1760, height: 1558, category: "Small SUV" }
        },
        "T-Roc": {
            "2017-2023": { length: 4234, width: 1819, height: 1573, category: "Small SUV" }
        },
        "Tiguan": {
            "2016-2023": { length: 4486, width: 1839, height: 1632, category: "SUV" },
            "2007-2016": { length: 4427, width: 1809, height: 1703, category: "SUV" }
        },
        "Tiguan Allspace": {
            "2017-2023": { length: 4701, width: 1839, height: 1674, category: "Large SUV" }
        },
        "Touareg": {
            "2018-2023": { length: 4878, width: 1984, height: 1717, category: "Large SUV" }
        },
        "Caddy": {
            "2020-2023": { length: 4501, width: 1855, height: 1797, category: "Small Van" },
            "2015-2020": { length: 4405, width: 1794, height: 1833, category: "Small Van" }
        },
        "Crafter": {
            "2017-2023": { length: 5986, width: 2037, height: 2591, category: "Large Van" }
        }
    },
    "BMW": {
        "1 Series": {
            "2019-2023": { length: 4319, width: 1799, height: 1434, category: "Medium Car" },
            "2011-2019": { length: 4324, width: 1765, height: 1421, category: "Medium Car" }
        },
        "2 Series": {
            "2021-2023": { length: 4386, width: 1824, height: 1435, category: "Medium Car" },
            "2014-2021": { length: 4342, width: 1774, height: 1421, category: "Medium Car" }
        },
        "3 Series": {
            "2019-2023": { length: 4709, width: 1827, height: 1442, category: "Large Car" },
            "2012-2019": { length: 4633, width: 1811, height: 1429, category: "Large Car" },
            "2005-2012": { length: 4520, width: 1817, height: 1421, category: "Large Car" }
        },
        "4 Series": {
            "2020-2023": { length: 4768, width: 1852, height: 1383, category: "Large Car" },
            "2013-2020": { length: 4638, width: 1825, height: 1362, category: "Large Car" }
        },
        "5 Series": {
            "2017-2023": { length: 4936, width: 1868, height: 1479, category: "Large Car" },
            "2010-2017": { length: 4907, width: 1860, height: 1464, category: "Large Car" }
        },
        "7 Series": {
            "2015-2023": { length: 5238, width: 1902, height: 1479, category: "Luxury Car" }
        },
        "X1": {
            "2022-2023": { length: 4500, width: 1845, height: 1642, category: "SUV" },
            "2015-2022": { length: 4439, width: 1821, height: 1598, category: "SUV" },
            "2009-2015": { length: 4454, width: 1798, height: 1545, category: "SUV" }
        },
        "X2": {
            "2018-2023": { length: 4379, width: 1824, height: 1526, category: "SUV" }
        },
        "X3": {
            "2017-2023": { length: 4708, width: 1891, height: 1676, category: "SUV" },
            "2010-2017": { length: 4657, width: 1881, height: 1674, category: "SUV" }
        },
        "X4": {
            "2018-2023": { length: 4752, width: 1918, height: 1621, category: "SUV" }
        },
        "X5": {
            "2018-2023": { length: 4922, width: 2004, height: 1745, category: "Large SUV" },
            "2013-2018": { length: 4886, width: 1938, height: 1762, category: "Large SUV" }
        },
        "X6": {
            "2019-2023": { length: 4935, width: 2004, height: 1696, category: "Large SUV" }
        },
        "X7": {
            "2019-2023": { length: 5151, width: 2000, height: 1805, category: "Large SUV" }
        },
        "i3": {
            "2013-2022": { length: 4011, width: 1775, height: 1578, category: "Electric Car" }
        },
        "iX3": {
            "2020-2023": { length: 4734, width: 1891, height: 1668, category: "Electric SUV" }
        }
    },
    "Audi": {
        "A1": {
            "2018-2023": { length: 4030, width: 1740, height: 1440, category: "Small Car" },
            "2010-2018": { length: 3954, width: 1741, height: 1416, category: "Small Car" }
        },
        "A3": {
            "2020-2023": { length: 4343, width: 1816, height: 1452, category: "Medium Car" },
            "2012-2020": { length: 4312, width: 1785, height: 1426, category: "Medium Car" },
            "2003-2012": { length: 4292, width: 1765, height: 1422, category: "Medium Car" }
        },
        "A4": {
            "2015-2023": { length: 4762, width: 1847, height: 1428, category: "Large Car" },
            "2008-2015": { length: 4701, width: 1826, height: 1427, category: "Large Car" }
        },
        "A5": {
            "2016-2023": { length: 4753, width: 1843, height: 1370, category: "Large Car" },
            "2007-2016": { length: 4626, width: 1854, height: 1372, category: "Large Car" }
        },
        "A6": {
            "2018-2023": { length: 4939, width: 1886, height: 1457, category: "Large Car" },
            "2011-2018": { length: 4915, width: 1874, height: 1455, category: "Large Car" }
        },
        "A7": {
            "2018-2023": { length: 4969, width: 1908, height: 1422, category: "Large Car" }
        },
        "A8": {
            "2017-2023": { length: 5172, width: 1945, height: 1473, category: "Luxury Car" }
        },
        "TT": {
            "2014-2023": { length: 4180, width: 1832, height: 1353, category: "Sports Car" }
        },
        "Q2": {
            "2016-2023": { length: 4191, width: 1794, height: 1508, category: "Small SUV" }
        },
        "Q3": {
            "2018-2023": { length: 4485, width: 1856, height: 1585, category: "SUV" },
            "2011-2018": { length: 4388, width: 1831, height: 1608, category: "SUV" }
        },
        "Q5": {
            "2017-2023": { length: 4663, width: 1893, height: 1659, category: "SUV" },
            "2008-2017": { length: 4629, width: 1880, height: 1653, category: "SUV" }
        },
        "Q7": {
            "2015-2023": { length: 5052, width: 1968, height: 1741, category: "Large SUV" },
            "2005-2015": { length: 5089, width: 1983, height: 1737, category: "Large SUV" }
        },
        "Q8": {
            "2018-2023": { length: 4986, width: 1995, height: 1705, category: "Large SUV" }
        },
        "e-tron": {
            "2019-2023": { length: 4901, width: 1935, height: 1616, category: "Electric SUV" }
        }
    },
    "Mercedes-Benz": {
        "A-Class": {
            "2018-2023": { length: 4419, width: 1796, height: 1440, category: "Medium Car" },
            "2012-2018": { length: 4292, width: 1780, height: 1433, category: "Medium Car" }
        },
        "B-Class": {
            "2018-2023": { length: 4419, width: 1796, height: 1562, category: "Medium Car" },
            "2011-2018": { length: 4359, width: 1786, height: 1557, category: "Medium Car" }
        },
        "C-Class": {
            "2021-2023": { length: 4751, width: 1820, height: 1437, category: "Large Car" },
            "2014-2021": { length: 4686, width: 1810, height: 1442, category: "Large Car" },
            "2007-2014": { length: 4581, width: 1770, height: 1447, category: "Large Car" }
        },
        "CLA": {
            "2019-2023": { length: 4688, width: 1830, height: 1439, category: "Large Car" },
            "2013-2019": { length: 4630, width: 1777, height: 1439, category: "Large Car" }
        },
        "E-Class": {
            "2016-2023": { length: 4923, width: 1852, height: 1468, category: "Large Car" },
            "2009-2016": { length: 4879, width: 1854, height: 1474, category: "Large Car" }
        },
        "S-Class": {
            "2020-2023": { length: 5179, width: 1921, height: 1503, category: "Luxury Car" },
            "2013-2020": { length: 5116, width: 1899, height: 1494, category: "Luxury Car" }
        },
        "GLA": {
            "2020-2023": { length: 4410, width: 1834, height: 1611, category: "SUV" },
            "2013-2020": { length: 4417, width: 1804, height: 1494, category: "SUV" }
        },
        "GLB": {
            "2019-2023": { length: 4634, width: 1834, height: 1659, category: "SUV" }
        },
        "GLC": {
            "2019-2023": { length: 4656, width: 1890, height: 1639, category: "SUV" },
            "2015-2019": { length: 4656, width: 1890, height: 1639, category: "SUV" }
        },
        "GLE": {
            "2019-2023": { length: 4924, width: 1947, height: 1772, category: "Large SUV" },
            "2015-2019": { length: 4817, width: 1935, height: 1796, category: "Large SUV" }
        },
        "GLS": {
            "2019-2023": { length: 5207, width: 1956, height: 1823, category: "Large SUV" }
        },
        "G-Class": {
            "2018-2023": { length: 4817, width: 1931, height: 1969, category: "Large SUV" }
        },
        "EQA": {
            "2021-2023": { length: 4463, width: 1834, height: 1620, category: "Electric SUV" }
        },
        "EQC": {
            "2019-2023": { length: 4761, width: 1884, height: 1624, category: "Electric SUV" }
        }
    },
    "Nissan": {
        "Micra": {
            "2017-2023": { length: 3999, width: 1743, height: 1455, category: "Small Car" },
            "2010-2017": { length: 3827, width: 1665, height: 1527, category: "Small Car" }
        },
        "Note": {
            "2013-2021": { length: 4100, width: 1695, height: 1535, category: "Small Car" },
            "2005-2013": { length: 4084, width: 1695, height: 1535, category: "Small Car" }
        },
        "Pulsar": {
            "2014-2018": { length: 4385, width: 1783, height: 1445, category: "Medium Car" }
        },
        "Sentra": {
            "2019-2023": { length: 4625, width: 1776, height: 1442, category: "Large Car" }
        },
        "370Z": {
            "2009-2020": { length: 4250, width: 1845, height: 1315, category: "Sports Car" }
        },
        "Juke": {
            "2019-2023": { length: 4210, width: 1800, height: 1595, category: "Small SUV" },
            "2010-2019": { length: 4135, width: 1765, height: 1565, category: "Small SUV" }
        },
        "Qashqai": {
            "2021-2023": { length: 4425, width: 1838, height: 1625, category: "SUV" },
            "2014-2021": { length: 4377, width: 1806, height: 1590, category: "SUV" },
            "2006-2014": { length: 4315, width: 1783, height: 1615, category: "SUV" }
        },
        "X-Trail": {
            "2022-2023": { length: 4648, width: 1839, height: 1705, category: "SUV" },
            "2014-2022": { length: 4690, width: 1820, height: 1710, category: "SUV" },
            "2007-2014": { length: 4630, width: 1785, height: 1685, category: "SUV" }
        },
        "Pathfinder": {
            "2013-2023": { length: 5157, width: 1961, height: 1767, category: "Large SUV" }
        },
        "Navara": {
            "2015-2023": { length: 5255, width: 1850, height: 1819, category: "Pickup" }
        },
        "NV200": {
            "2009-2023": { length: 4400, width: 1695, height: 1861, category: "Small Van" }
        },
        "NV300": {
            "2016-2023": { length: 4999, width: 1956, height: 1890, category: "Medium Van" }
        },
        "NV400": {
            "2011-2023": { length: 5998, width: 2037, height: 2591, category: "Large Van" }
        },
        "Leaf": {
            "2017-2023": { length: 4490, width: 1788, height: 1540, category: "Electric Car" },
            "2010-2017": { length: 4445, width: 1770, height: 1549, category: "Electric Car" }
        },
        "Ariya": {
            "2022-2023": { length: 4595, width: 1850, height: 1660, category: "Electric SUV" }
        }
    },
    "Toyota": {
        "Aygo": {
            "2014-2022": { length: 3455, width: 1615, height: 1460, category: "Small Car" },
            "2005-2014": { length: 3405, width: 1615, height: 1465, category: "Small Car" }
        },
        "Yaris": {
            "2020-2023": { length: 3940, width: 1745, height: 1500, category: "Small Car" },
            "2011-2020": { length: 3945, width: 1695, height: 1510, category: "Small Car" },
            "2005-2011": { length: 3885, width: 1695, height: 1510, category: "Small Car" }
        },
        "Corolla": {
            "2019-2023": { length: 4370, width: 1790, height: 1435, category: "Medium Car" },
            "2013-2019": { length: 4300, width: 1776, height: 1465, category: "Medium Car" },
            "2007-2013": { length: 4300, width: 1776, height: 1465, category: "Medium Car" }
        },
        "Camry": {
            "2018-2023": { length: 4885, width: 1840, height: 1445, category: "Large Car" }
        },
        "Prius": {
            "2016-2023": { length: 4540, width: 1760, height: 1470, category: "Hybrid Car" },
            "2009-2016": { length: 4460, width: 1745, height: 1490, category: "Hybrid Car" }
        },
        "Supra": {
            "2019-2023": { length: 4379, width: 1854, height: 1293, category: "Sports Car" }
        },
        "C-HR": {
            "2016-2023": { length: 4360, width: 1795, height: 1555, category: "Small SUV" }
        },
        "RAV4": {
            "2019-2023": { length: 4600, width: 1855, height: 1685, category: "SUV" },
            "2013-2019": { length: 4570, width: 1845, height: 1670, category: "SUV" },
            "2006-2013": { length: 4570, width: 1815, height: 1685, category: "SUV" }
        },
        "Highlander": {
            "2020-2023": { length: 4950, width: 1930, height: 1730, category: "Large SUV" }
        },
        "Land Cruiser": {
            "2021-2023": { length: 4950, width: 1980, height: 1925, category: "Large SUV" }
        },
        "Hilux": {
            "2016-2023": { length: 5330, width: 1855, height: 1815, category: "Pickup" }
        },
        "Proace": {
            "2016-2023": { length: 4959, width: 1956, height: 1890, category: "Medium Van" }
        },
        "bZ4X": {
            "2022-2023": { length: 4690, width: 1860, height: 1650, category: "Electric SUV" }
        }
    },
    "Honda": {
        "Jazz": {
            "2020-2023": { length: 4090, width: 1694, height: 1571, category: "Small Car" },
            "2015-2020": { length: 4030, width: 1694, height: 1525, category: "Small Car" },
            "2008-2015": { length: 3900, width: 1694, height: 1525, category: "Small Car" }
        },
        "Civic": {
            "2022-2023": { length: 4550, width: 1802, height: 1415, category: "Medium Car" },
            "2017-2021": { length: 4518, width: 1799, height: 1434, category: "Medium Car" },
            "2012-2017": { length: 4329, width: 1772, height: 1477, category: "Medium Car" }
        },
        "Accord": {
            "2018-2023": { length: 4893, width: 1862, height: 1450, category: "Large Car" }
        },
        "NSX": {
            "2016-2022": { length: 4490, width: 1940, height: 1215, category: "Sports Car" }
        },
        "HR-V": {
            "2021-2023": { length: 4330, width: 1790, height: 1590, category: "Small SUV" },
            "2015-2021": { length: 4294, width: 1772, height: 1605, category: "Small SUV" }
        },
        "CR-V": {
            "2018-2023": { length: 4597, width: 1855, height: 1679, category: "SUV" },
            "2012-2018": { length: 4545, width: 1820, height: 1685, category: "SUV" }
        },
        "Pilot": {
            "2016-2023": { length: 4992, width: 1996, height: 1773, category: "Large SUV" }
        },
        "Ridgeline": {
            "2017-2023": { length: 5410, width: 1996, height: 1781, category: "Pickup" }
        },
        "e": {
            "2020-2023": { length: 3894, width: 1752, height: 1512, category: "Electric Car" }
        }
    },
    "Hyundai": {
        "i10": {
            "2019-2023": { length: 3670, width: 1680, height: 1480, category: "Small Car" },
            "2013-2019": { length: 3665, width: 1660, height: 1480, category: "Small Car" }
        },
        "i20": {
            "2020-2023": { length: 4040, width: 1775, height: 1450, category: "Small Car" },
            "2014-2020": { length: 4035, width: 1734, height: 1470, category: "Small Car" }
        },
        "i30": {
            "2017-2023": { length: 4340, width: 1795, height: 1455, category: "Medium Car" },
            "2012-2017": { length: 4295, width: 1780, height: 1470, category: "Medium Car" }
        },
        "Elantra": {
            "2020-2023": { length: 4680, width: 1826, height: 1415, category: "Large Car" }
        },
        "Sonata": {
            "2019-2023": { length: 4900, width: 1860, height: 1445, category: "Large Car" }
        },
        "Veloster": {
            "2018-2022": { length: 4165, width: 1790, height: 1408, category: "Sports Car" }
        },
        "Kona": {
            "2017-2023": { length: 4165, width: 1800, height: 1550, category: "Small SUV" }
        },
        "Tucson": {
            "2021-2023": { length: 4500, width: 1865, height: 1650, category: "SUV" },
            "2015-2021": { length: 4475, width: 1850, height: 1645, category: "SUV" }
        },
        "Santa Fe": {
            "2018-2023": { length: 4770, width: 1890, height: 1680, category: "Large SUV" }
        },
        "Palisade": {
            "2019-2023": { length: 4980, width: 1975, height: 1750, category: "Large SUV" }
        },
        "iLoad": {
            "2008-2023": { length: 5125, width: 1920, height: 1925, category: "Medium Van" }
        },
        "IONIQ 5": {
            "2021-2023": { length: 4635, width: 1890, height: 1605, category: "Electric SUV" }
        },
        "Kona Electric": {
            "2018-2023": { length: 4180, width: 1800, height: 1570, category: "Electric SUV" }
        }
    },
    "Kia": {
        "Picanto": {
            "2017-2023": { length: 3595, width: 1595, height: 1485, category: "Small Car" },
            "2011-2017": { length: 3595, width: 1595, height: 1485, category: "Small Car" }
        },
        "Rio": {
            "2017-2023": { length: 4065, width: 1725, height: 1455, category: "Small Car" },
            "2011-2017": { length: 4045, width: 1700, height: 1455, category: "Small Car" }
        },
        "Ceed": {
            "2018-2023": { length: 4310, width: 1800, height: 1447, category: "Medium Car" },
            "2012-2018": { length: 4310, width: 1780, height: 1470, category: "Medium Car" }
        },
        "Forte": {
            "2018-2023": { length: 4640, width: 1800, height: 1440, category: "Large Car" }
        },
        "Optima": {
            "2015-2020": { length: 4855, width: 1860, height: 1465, category: "Large Car" }
        },
        "Stinger": {
            "2017-2023": { length: 4830, width: 1870, height: 1400, category: "Sports Car" }
        },
        "Stonic": {
            "2017-2023": { length: 4140, width: 1760, height: 1520, category: "Small SUV" }
        },
        "Niro": {
            "2016-2023": { length: 4355, width: 1805, height: 1560, category: "Small SUV" }
        },
        "Sportage": {
            "2022-2023": { length: 4515, width: 1865, height: 1650, category: "SUV" },
            "2016-2022": { length: 4480, width: 1855, height: 1635, category: "SUV" },
            "2010-2016": { length: 4440, width: 1855, height: 1645, category: "SUV" }
        },
        "Sorento": {
            "2020-2023": { length: 4810, width: 1900, height: 1700, category: "Large SUV" },
            "2015-2020": { length: 4780, width: 1890, height: 1685, category: "Large SUV" }
        },
        "Telluride": {
            "2019-2023": { length: 5000, width: 1990, height: 1750, category: "Large SUV" }
        },
        "EV6": {
            "2021-2023": { length: 4680, width: 1880, height: 1550, category: "Electric SUV" }
        },
        "Soul EV": {
            "2019-2023": { length: 4195, width: 1800, height: 1605, category: "Electric SUV" }
        }
    },
    "Peugeot": {
        "108": {
            "2014-2023": { length: 3475, width: 1615, height: 1460, category: "Small Car" }
        },
        "208": {
            "2019-2023": { length: 4055, width: 1745, height: 1430, category: "Small Car" },
            "2012-2019": { length: 3962, width: 1739, height: 1460, category: "Small Car" }
        },
        "308": {
            "2021-2023": { length: 4367, width: 1804, height: 1457, category: "Medium Car" },
            "2013-2021": { length: 4253, width: 1804, height: 1457, category: "Medium Car" }
        },
        "508": {
            "2018-2023": { length: 4750, width: 1859, height: 1402, category: "Large Car" },
            "2010-2018": { length: 4792, width: 1858, height: 1426, category: "Large Car" }
        },
        "2008": {
            "2019-2023": { length: 4300, width: 1770, height: 1550, category: "Small SUV" },
            "2013-2019": { length: 4159, width: 1739, height: 1556, category: "Small SUV" }
        },
        "3008": {
            "2016-2023": { length: 4447, width: 1841, height: 1624, category: "SUV" },
            "2009-2016": { length: 4365, width: 1837, height: 1639, category: "SUV" }
        },
        "5008": {
            "2017-2023": { length: 4641, width: 1844, height: 1646, category: "Large SUV" },
            "2009-2017": { length: 4530, width: 1844, height: 1679, category: "Large SUV" }
        },
        "Partner": {
            "2018-2023": { length: 4403, width: 1848, height: 1814, category: "Small Van" }
        },
        "Expert": {
            "2016-2023": { length: 4959, width: 1956, height: 1890, category: "Medium Van" }
        },
        "Boxer": {
            "2014-2023": { length: 5998, width: 2050, height: 2524, category: "Large Van" }
        },
        "e-208": {
            "2019-2023": { length: 4055, width: 1745, height: 1430, category: "Electric Car" }
        },
        "e-2008": {
            "2019-2023": { length: 4300, width: 1770, height: 1550, category: "Electric SUV" }
        }
    },
    "Renault": {
        "Twingo": {
            "2014-2023": { length: 3615, width: 1646, height: 1554, category: "Small Car" }
        },
        "Clio": {
            "2019-2023": { length: 4050, width: 1798, height: 1440, category: "Small Car" },
            "2012-2019": { length: 4063, width: 1732, height: 1448, category: "Small Car" },
            "2005-2012": { length: 4000, width: 1718, height: 1448, category: "Small Car" }
        },
        "Megane": {
            "2020-2023": { length: 4210, width: 1768, height: 1505, category: "Medium Car" },
            "2016-2020": { length: 4359, width: 1814, height: 1447, category: "Medium Car" },
            "2008-2016": { length: 4299, width: 1814, height: 1471, category: "Medium Car" }
        },
        "Talisman": {
            "2015-2022": { length: 4850, width: 1870, height: 1459, category: "Large Car" }
        },
        "Captur": {
            "2019-2023": { length: 4227, width: 1797, height: 1576, category: "Small SUV" },
            "2013-2019": { length: 4122, width: 1778, height: 1566, category: "Small SUV" }
        },
        "Kadjar": {
            "2015-2022": { length: 4449, width: 1837, height: 1613, category: "SUV" }
        },
        "Koleos": {
            "2017-2023": { length: 4672, width: 1843, height: 1678, category: "SUV" }
        },
        "Arkana": {
            "2021-2023": { length: 4568, width: 1571, height: 1571, category: "SUV" }
        },
        "Kangoo": {
            "2021-2023": { length: 4486, width: 1829, height: 1836, category: "Small Van" },
            "2008-2021": { length: 4213, width: 1829, height: 1810, category: "Small Van" }
        },
        "Trafic": {
            "2014-2023": { length: 4999, width: 1956, height: 1890, category: "Medium Van" }
        },
        "Master": {
            "2010-2023": { length: 5998, width: 2037, height: 2591, category: "Large Van" }
        },
        "Zoe": {
            "2019-2023": { length: 4087, width: 1787, height: 1562, category: "Electric Car" },
            "2012-2019": { length: 4084, width: 1730, height: 1562, category: "Electric Car" }
        },
        "Megane E-Tech": {
            "2022-2023": { length: 4210, width: 1768, height: 1505, category: "Electric SUV" }
        }
    },
    "Skoda": {
        "Citigo": {
            "2011-2020": { length: 3563, width: 1645, height: 1478, category: "Small Car" }
        },
        "Fabia": {
            "2021-2023": { length: 4108, width: 1740, height: 1471, category: "Small Car" },
            "2014-2021": { length: 3992, width: 1732, height: 1467, category: "Small Car" },
            "2007-2014": { length: 3992, width: 1642, height: 1498, category: "Small Car" }
        },
        "Scala": {
            "2019-2023": { length: 4362, width: 1793, height: 1471, category: "Medium Car" }
        },
        "Octavia": {
            "2019-2023": { length: 4689, width: 1829, height: 1469, category: "Large Car" },
            "2013-2019": { length: 4659, width: 1814, height: 1460, category: "Large Car" },
            "2004-2013": { length: 4569, width: 1769, height: 1462, category: "Large Car" }
        },
        "Superb": {
            "2015-2023": { length: 4869, width: 1864, height: 1469, category: "Large Car" },
            "2008-2015": { length: 4838, width: 1817, height: 1462, category: "Large Car" }
        },
        "Kamiq": {
            "2019-2023": { length: 4241, width: 1793, height: 1553, category: "Small SUV" }
        },
        "Karoq": {
            "2017-2023": { length: 4382, width: 1841, height: 1605, category: "SUV" }
        },
        "Kodiaq": {
            "2016-2023": { length: 4697, width: 1882, height: 1676, category: "Large SUV" }
        },
        "Roomster": {
            "2006-2015": { length: 4203, width: 1684, height: 1607, category: "Small Van" }
        },
        "Enyaq iV": {
            "2021-2023": { length: 4649, width: 1879, height: 1616, category: "Electric SUV" }
        }
    },
    "SEAT": {
        "Mii": {
            "2011-2020": { length: 3563, width: 1645, height: 1478, category: "Small Car" }
        },
        "Ibiza": {
            "2017-2023": { length: 4059, width: 1780, height: 1444, category: "Small Car" },
            "2008-2017": { length: 4059, width: 1693, height: 1445, category: "Small Car" }
        },
        "Leon": {
            "2020-2023": { length: 4368, width: 1799, height: 1456, category: "Medium Car" },
            "2012-2020": { length: 4263, width: 1816, height: 1459, category: "Medium Car" },
            "2005-2012": { length: 4222, width: 1768, height: 1459, category: "Medium Car" }
        },
        "Toledo": {
            "2012-2019": { length: 4482, width: 1706, height: 1461, category: "Large Car" }
        },
        "Arona": {
            "2017-2023": { length: 4138, width: 1780, height: 1552, category: "Small SUV" }
        },
        "Ateca": {
            "2016-2023": { length: 4363, width: 1841, height: 1601, category: "SUV" }
        },
        "Tarraco": {
            "2018-2023": { length: 4735, width: 1839, height: 1658, category: "Large SUV" }
        },
        "Alhambra": {
            "2010-2020": { length: 4854, width: 1904, height: 1720, category: "Large MPV" }
        },
        "Born": {
            "2021-2023": { length: 4322, width: 1809, height: 1537, category: "Electric Car" }
        }
    },
    "Mazda": {
        "2": {
            "2014-2023": { length: 4065, width: 1695, height: 1525, category: "Small Car" },
            "2007-2014": { length: 4020, width: 1695, height: 1475, category: "Small Car" }
        },
        "3": {
            "2019-2023": { length: 4460, width: 1795, height: 1440, category: "Medium Car" },
            "2013-2019": { length: 4460, width: 1795, height: 1455, category: "Medium Car" },
            "2009-2013": { length: 4580, width: 1755, height: 1465, category: "Medium Car" }
        },
        "6": {
            "2018-2023": { length: 4865, width: 1840, height: 1450, category: "Large Car" },
            "2012-2018": { length: 4870, width: 1840, height: 1450, category: "Large Car" }
        },
        "MX-5": {
            "2015-2023": { length: 3915, width: 1735, height: 1245, category: "Sports Car" },
            "2005-2015": { length: 4020, width: 1720, height: 1245, category: "Sports Car" }
        },
        "CX-3": {
            "2015-2023": { length: 4275, width: 1765, height: 1550, category: "Small SUV" }
        },
        "CX-30": {
            "2019-2023": { length: 4395, width: 1795, height: 1540, category: "SUV" }
        },
        "CX-5": {
            "2017-2023": { length: 4550, width: 1840, height: 1680, category: "SUV" },
            "2012-2017": { length: 4540, width: 1840, height: 1710, category: "SUV" }
        },
        "CX-9": {
            "2016-2023": { length: 5065, width: 1969, height: 1747, category: "Large SUV" }
        },
        "BT-50": {
            "2020-2023": { length: 5350, width: 1870, height: 1790, category: "Pickup" }
        },
        "MX-30": {
            "2020-2023": { length: 4395, width: 1795, height: 1540, category: "Electric SUV" }
        }
    },
    "Mini": {
        "Hatch": {
            "2019-2023": { length: 3821, width: 1727, height: 1414, category: "Small Car" },
            "2014-2019": { length: 3821, width: 1727, height: 1414, category: "Small Car" },
            "2006-2014": { length: 3714, width: 1683, height: 1407, category: "Small Car" }
        },
        "Convertible": {
            "2016-2023": { length: 3821, width: 1727, height: 1415, category: "Small Car" }
        },
        "Clubman": {
            "2019-2023": { length: 4253, width: 1800, height: 1441, category: "Medium Car" },
            "2015-2019": { length: 4253, width: 1800, height: 1441, category: "Medium Car" }
        },
        "Countryman": {
            "2020-2023": { length: 4299, width: 1822, height: 1557, category: "SUV" },
            "2017-2020": { length: 4299, width: 1822, height: 1557, category: "SUV" },
            "2010-2017": { length: 4110, width: 1789, height: 1561, category: "SUV" }
        },
        "Paceman": {
            "2013-2016": { length: 4110, width: 1789, height: 1549, category: "SUV" }
        },
        "Electric": {
            "2019-2023": { length: 3845, width: 1727, height: 1432, category: "Electric Car" }
        }
    },
    "Volvo": {
        "V40": {
            "2012-2019": { length: 4369, width: 1802, height: 1445, category: "Medium Car" }
        },
        "S60": {
            "2018-2023": { length: 4761, width: 1850, height: 1431, category: "Large Car" },
            "2010-2018": { length: 4635, width: 1865, height: 1484, category: "Large Car" }
        },
        "S90": {
            "2016-2023": { length: 4963, width: 1879, height: 1443, category: "Large Car" }
        },
        "V60": {
            "2018-2023": { length: 4761, width: 1850, height: 1427, category: "Large Car" }
        },
        "V90": {
            "2016-2023": { length: 4936, width: 1879, height: 1475, category: "Large Car" }
        },
        "XC40": {
            "2017-2023": { length: 4425, width: 1863, height: 1652, category: "SUV" }
        },
        "XC60": {
            "2017-2023": { length: 4688, width: 1902, height: 1658, category: "SUV" },
            "2008-2017": { length: 4628, width: 1891, height: 1713, category: "SUV" }
        },
        "XC90": {
            "2015-2023": { length: 4950, width: 1931, height: 1776, category: "Large SUV" },
            "2002-2014": { length: 4807, width: 1898, height: 1784, category: "Large SUV" }
        },
        "C40": {
            "2021-2023": { length: 4440, width: 1873, height: 1591, category: "Electric SUV" }
        },
        "XC40 Recharge": {
            "2020-2023": { length: 4425, width: 1863, height: 1651, category: "Electric SUV" }
        }
    },
    "Jaguar": {
        "XE": {
            "2015-2023": { length: 4672, width: 1850, height: 1416, category: "Large Car" }
        },
        "XF": {
            "2015-2023": { length: 4954, width: 1880, height: 1457, category: "Large Car" },
            "2008-2015": { length: 4961, width: 1877, height: 1460, category: "Large Car" }
        },
        "XJ": {
            "2009-2019": { length: 5127, width: 1899, height: 1448, category: "Luxury Car" }
        },
        "F-Type": {
            "2013-2023": { length: 4470, width: 1923, height: 1311, category: "Sports Car" }
        },
        "E-Pace": {
            "2017-2023": { length: 4395, width: 1984, height: 1649, category: "SUV" }
        },
        "F-Pace": {
            "2016-2023": { length: 4731, width: 1936, height: 1670, category: "SUV" }
        },
        "I-Pace": {
            "2018-2023": { length: 4682, width: 2011, height: 1565, category: "Electric SUV" }
        }
    },
    "Land Rover": {
        "Discovery Sport": {
            "2019-2023": { length: 4597, width: 2069, height: 1724, category: "SUV" },
            "2014-2019": { length: 4599, width: 1894, height: 1724, category: "SUV" }
        },
        "Discovery": {
            "2017-2023": { length: 4956, width: 2073, height: 1888, category: "Large SUV" },
            "2009-2017": { length: 4829, width: 1920, height: 1890, category: "Large SUV" }
        },
        "Range Rover Evoque": {
            "2019-2023": { length: 4371, width: 1904, height: 1649, category: "SUV" },
            "2011-2019": { length: 4355, width: 1900, height: 1635, category: "SUV" }
        },
        "Range Rover Velar": {
            "2017-2023": { length: 4803, width: 1930, height: 1665, category: "SUV" }
        },
        "Range Rover Sport": {
            "2022-2023": { length: 4879, width: 2073, height: 1820, category: "Large SUV" },
            "2013-2022": { length: 4850, width: 1986, height: 1780, category: "Large SUV" }
        },
        "Range Rover": {
            "2022-2023": { length: 5052, width: 2073, height: 1870, category: "Large SUV" },
            "2012-2022": { length: 5004, width: 1983, height: 1835, category: "Large SUV" }
        },
        "Defender": {
            "2020-2023": { length: 4583, width: 1996, height: 1967, category: "Large SUV" }
        }
    },
    "Tesla": {
        "Model S": {
            "2021-2023": { length: 4979, width: 1964, height: 1445, category: "Electric Car" },
            "2012-2021": { length: 4970, width: 1964, height: 1435, category: "Electric Car" }
        },
        "Model 3": {
            "2017-2023": { length: 4694, width: 1849, height: 1443, category: "Electric Car" }
        },
        "Model X": {
            "2021-2023": { length: 5037, width: 1999, height: 1684, category: "Electric SUV" },
            "2015-2021": { length: 5037, width: 2070, height: 1684, category: "Electric SUV" }
        },
        "Model Y": {
            "2021-2023": { length: 4751, width: 1921, height: 1624, category: "Electric SUV" }
        }
    },
    "Dacia": {
        "Sandero": {
            "2020-2023": { length: 4088, width: 1848, height: 1499, category: "Small Car" },
            "2012-2020": { length: 4059, width: 1733, height: 1519, category: "Small Car" }
        },
        "Logan": {
            "2020-2023": { length: 4348, width: 1848, height: 1499, category: "Medium Car" },
            "2012-2020": { length: 4359, width: 1733, height: 1517, category: "Medium Car" }
        },
        "Duster": {
            "2021-2023": { length: 4341, width: 1804, height: 1682, category: "SUV" },
            "2017-2021": { length: 4341, width: 1804, height: 1682, category: "SUV" },
            "2010-2017": { length: 4315, width: 1822, height: 1695, category: "SUV" }
        },
        "Spring": {
            "2021-2023": { length: 3734, width: 1579, height: 1519, category: "Electric Car" }
        }
    }
};