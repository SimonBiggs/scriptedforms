# Benefits of AGPL-3.0+ for Medical Physics

The aim of this document is to outline some of the benefits of Medical Physics code being released under an open source license. In particular the benefits of the AGPL-3.0+ licence. An example of a well known code base that uses this open source licence is EGSnrc (<https://www.nrc-cnrc.gc.ca/eng/solutions/advisory/egsnrc_index.html>).

A summary of this license and what it entails is available at: <https://choosealicense.com/licenses/agpl-3.0/>.

## Software is less dependent on a single software developer

A significant issue with software that is built by a small software development team is the "bus
factor". In the event that key team members are lost the software is no longer able to be easily
maintained. By opening the code up to the community the number of people who understand the
code base is increased. This reduces the dependence on any single employee for the ongoing
maintenance of the code packages.

Additionally software development by single developers carry any weaknesses that developer has as
a programmer and its only strengths will be limited to those of that programmer. Medical Physicists
are generally not trained software engineers, and when it comes to programming we often have
many weaknesses that need a light shined upon.

This was the justification provided by the radiation therapy QATrack+ team
(<http://qatrackplus.com/>) for open sourcing their tools
(<http://randlet.com/static/downloads/papers/QATrack+%20Odette%20Cancer%20Centre.pdf>).

## Safer and higher quality software

By leveraging the community in software production there will be more minds, more programmers,
and more readers of the code. Together there will be more combined time to implement software
engineering best practices and there are physicists in the community who are keen to support best
practice software engineering. The community will be able to fix bugs, implement programmatic
testing, highlight security issues, and generally all round produce safer and higher quality software
than a sole physicist turned programmer ever could.

## Software that is more compatible with a wide range of systems

Users of open source code who are also programmers who have systems which differ to the author’s
will be able to improve compatibility issues themselves. This iterative process with the community
makes it so that the software has a more seamless interaction with the range of systems in use.

An example of this is the Pylinac quality assurance tool
(<http://pylinac.readthedocs.io/en/latest/index.html>). It was built by a physicist who works at a
Varian site. Another physicist submitted code improvements to make the software tool compatible
with Elekta (<https://github.com/jrkerns/pylinac/pull/67>).

## Still possible to potentially monetise

The AGPL-3.0+ requires that code include programmatic build and installation instructions. This
means that users who are also programmers will likely be able to put in the work to get the software
running by themselves without payment to the authors. However in this case there is no one being
paid to provide user support and the default is no included warranty.

As a result there still is likely a market for providing the full toolset in a user friendly, warranty
included, batteries included, fully supported package. An example of a product and company that
uses exactly this business model is the medical imaging DICOM server Orthanc which offers
commercial services through the company Osimis (<http://www.osimis.io/en/products.html>).

There is also the opportunity for advertising revenue.

## Protection against another actor creating a closed source competitor

By releasing the code under the AGPL-3.0+ license any future work that makes use of the open
source code must also be released under the same license. This means that should another actor
create a competing product to the original author’s should they ever distribute the code
they must also release all changes under the AGPL-3.0+ license along with that distribution. In
effect unless that company is willing to release all of their own code that is bundled with the
author’s code to the community they cannot use the original source code to compete.

## Improving our work as Physicists

The software we write is written for the purpose of improving our work as physicists. Having the
community improve the software we write directly improves the quality of the work we undergo.

## Improving the programming skill of employees through community feedback

Programming skills are significantly benefited by having competent programmers read the code and
provide feedback. Community feedback on code itself is invaluable for improving the skill of the
programmers writing the original code. The depth and breadth of feedback from the community on
programming practices would unable to be matched within a small team.

## Software that has more applications and more features

As members of the community have needs those with programming skill may extend the code that is
provided to meet those needs. This results in the code having more applications and features than
would be possible should the code be kept in house.

## Improvements will by default be in a compatible format

Should the community create code built on top of the released software tools, those improvements
will built on top of the format that is already implemented. This allows those improvements to be
integrated within already implemented systems with minimal friction.
