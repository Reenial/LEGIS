# 1. Project Scope
## 1.1 Problem and Project Objective

**Lost And Found:**  Studenti i zaposlenici na fakultetu svakodnevno gube i pronalaze osobne predmete, poput studentskih iskaznica, ključeva, novčanika, slušalica i odjeće. Informacije o izgubljenim i pronađenim predmetima objavljuju se u različitim studentskim grupama i na društvenim mrežama, zbog čega je teško pregledati sve relevantne objave i povezati pronađeni predmet s njegovim vlasnikom. 

Dodatni problem predstavlja *provjera vlasništva*. Javno otkrivanje svih obilježja predmeta može omogućiti da povrat zatraži osoba kojoj predmet ne pripada. Zato je potrebno omogućiti provjeru određenih detalja bez njihova prikazivanja u javnoj objavi.

***Cilj projekta Lost & Found*** je razviti web-aplikaciju koja na jednom mjestu povezuje objave izgubljenih i pronađenih predmeta. Aplikacija treba omogućiti pregled i pretraživanje objava, prikaz lokacije pronalaska predmeta na karti, slanje i obradu zahtjeva za povrat te privatno dogovaranje preuzimanja.

*Očekivana korist* je jednostavnije pronalaženje relevantnih objava i dogovaranje povrata, uz manju potrebu za javnim objavljivanjem osobnih kontaktnih podataka. Aplikacija pomaže u procjeni zahtjeva za povrat, ali ne jamči da je podnositelj zahtjeva stvarni vlasnik.

## 1.2 Intended Users and Stakeholders

| User or stakeholder group | Need or interest relevant to this project |
| --- | --- |
| Studenti / zaposlenici koji su izgubili predmet | Pronaći izgubljeni predmet, stupiti u kontakt s pronalaziteljem i dogovoriti preuzimanje. |
| Studenti / zaposlenici koji su pronašli predmet | Pronaći vlasnika predmeta, provjeriti pripada li mu predmet i dogovoriti predaju. |
| Posjetitelji bez prijave | Pristupiti informacijama o izgubljenim i pronađenim predmetima bez obveze prijave. |
| Administrator | Održavati sadržaj pouzdanim i primjerenim te spriječiti zlouporabu sustava.
| Projektni tim | Uspješno ostvariti projektni zadatak i razviti vještine timskog rada i razvoja programske potpore.
| Nastavno osoblje kolegija | Pratiti rad projektnog tima i vrednovati ispunjenost zahtjeva projektnog zadatka. |


## 1.3 Project Boundaries

**Included:** 
 - Objava, pregled i pretraživanje izgubljenih i pronađenih predmeta uz prikaz lokacije na karti
 - Postupak povrata -> zahtjevi za povrat, provjera skrivenih detalja predmeta i privatno dogovaranje preuzimanja
 - Prijedlozi mogućih podudaranja
 - Obavijesti u aplikaciji
 - Prijavljivanje i moderiranje neprimjerenih objava

**Excluded or deferred:** 
 - Fizičko čuvanje, dostava i preuzimanje predmeta (predaju dogovaraju sami korisnici) 
 - Aplikacija pomaže u procjeni vlasništva, ali ga ne jamči
 - Nije predviđena zasebna mobilna aplikacija, nego web-aplikacija prilagođena mobilnim uređajima

**External dependencies:** 
 - Vanjski pružatelj identiteta omogućuje prijavu putem OAuth 2.0
 - Vanjska usluga karata ili geokodiranja omogućuje odabir i prikaz lokacije
 - Određivanje lokacije GPS-om ovisi o mogućnostima uređaja i dopuštenju korisnika, uz mogućnost ručnog odabira na karti

## 1.4 Existing Approaches and Project Rationale

Prema projektnom zadatku, informacije o pronađenim predmetima trenutačno se dijele u studentskim grupama i na društvenim mrežama. Takav pristup omogućuje obavještavanje drugih korisnika, ali zahtijeva pregledavanje različitih kanala kako bi se pronašla relevantna objava. Lost & Found treba objediniti te informacije na jednom mjestu i omogućiti njihovo pretraživanje prema obilježjima predmeta, lokaciji i vremenu.

Izvor: projektni zadatak „Lost & Found”, odjeljci 1. i 2.
