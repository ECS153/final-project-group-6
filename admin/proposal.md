# Proposal
Send us a paragraph about (1) what problem are you solving, (2) why is it important, (3) what do you plan to build, and (4) what are your expected results. Your proposal should be around 300 words (please don't go over) and your prose should be polished (make sure that it flows well and is free of spelling and grammar mistakes).

## Problem: Hacking a Virtual Machine
Virtual machines are entirely separate from the host computers that run them. They are considered a good way to safely test new stuff without consequences on the actual computer. However, VMs are meant to mimic their hosts, which means they are inherently just as exploitable as actual computers. Thus, we plan to hack a virtual machine in order to showcase how unprotected virtual environments are. 

## Why is it important
Virtualization helps to reduce the operational cost and still provide developers with efficiency and flexibility, but it is still vulnerable to the traditional attacks. It could also have security issues other than traditional attacks. For example, a virtual machine that is not virus protected and in a shared networking configuration can be used by an attacker to scan both the private and public address spaces. More and more students use virtual machines nowadays. It is very important for us to be aware of the security issues that occur in the virtualization environments. 

## What do we plan to build
Our team plans on creating a program in Python that will hack into a virtual machine. We plan on trying several options of hacking including locating the virtual machine via the MAC address and possibly downloading malicious software via email. We are still doing research to determine the best way to hack. 

## Our Expected Results
By the end of our project, we aim to successfully take control of a certain aspect of the virtual machine (downloading malicious software or deleting files) and to learn about how/where its vulnerabilities lie. Doing so would help us understand how an adversary thinks and what we could do to make such attacks harder to execute. If time permits, we could try defending against our own attacks and seeing if we could implement more complications for the adversarial side.
