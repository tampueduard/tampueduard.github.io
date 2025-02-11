This project has been realized during a 2 months artistic research visit at UrbNet (Center for Urban Network Evolutions) based at Aarhus University (DK). The scope of this visit was to create a tentative approach of Data Sonification to project MINERVA: the first and most detailed digital model of all roads of the Roman Empire [^1]. 

Together with Dr. Tom Brughmans and the Minerva team, we wanted to focus on exploring mobility through the Roman Road system, exploring possibilities of sonification through network systems.

For the realization of this tentative approach I started with building an understanding of what was the structure and elements of the data. I thus started approaching the original GeoSpatial, looking for a way of simplifying them. Using python libraries like [geopandas](https://geopandas.org/en/stable/index.html) and [momepy](https://docs.momepy.org/en/stable/) I started making my way through this data.

[^1] See more about the research at: [Minerva](https://projects.au.dk/minerva/) and [Itiner-e.org](https://itiner-e.org). 

![Datasonification](images/minerva_sonification/datasonification_minerva_1.svg)

Thanks to libraries like networkx I was able to explore the data and create a network representation of it, thus exporting a set of coordinates representing the nodes and edges which I could use inside Max/MSP for purposes like visualization and navigation through the road system. 

<iframe src="https://drive.google.com/file/d/19zdShgQ5jgs-nT-XB6a0Bl189knCbZyx/preview" allow="autoplay" frameborder="0" allowfullscreen=""></iframe>

I thus collected a set of information such as, the path from reaching point B from point A, altitude data, sum of the length and other. This created the basis upon which the sonification system was integrated thanks to a database in which I could pull this pre-collected information based on the node-or-edge which we are moving through. This information in turn was then processed by a javascript in max, where the edge information is used to evaluate the pitch and length of each note. This was quantized to pitches in a scale based on different regions of the empire. 

By going from point A to point B in the network, two elements were realized: a chord progression, that was following the journey through the path, constructed based on the adjacent edges to the specific node. Moreover a sequence is produced based on the entirety of the path, constantly looping.

The quality of the sounds was driven by set of information that was retrieved fom each node, such as how many nodes are in the range of 30km and how many km that specific node connects. These informed with variables that changing through time, allow for a shift in sonic qualities which reflect specific qualities of that area.

![Datasonification](images/minerva_sonification/datasonification_minerva_2.svg)

The process I tried to develop saw its sonic output coming from Ableton Live, which was used for its open sonic features and because substantially sped-up the process of sonifiying seen the time-span of the project. Thus, MIDI and OSC messages were sent from Max into Ableton, from where the sound design occurred.

<iframe src="https://drive.google.com/file/d/1XRwwMMQb6tYJoXEzeiXrWJtxnPSTMxTr/preview" allow="autoplay"></iframe>
<iframe src="https://drive.google.com/file/d/1KLStsjVyuAvWJtTgkHmKmwZC2COf17AS/preview" allow="autoplay"></iframe>