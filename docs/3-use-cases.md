# 3. Use Cases
## 3.1 Use Case Diagram

![Dijagram slučajeva uporabe Lost & Found](./assets/diagrams/lostAndFound.svg)

**PlantUML izvor:** [Izvorni kod dijagrama](./puml/lost-and-found-UC.puml)

## 3.2 Use Case Descriptions

### UC-001: Pregledati, pretražiti i filtrirati objave

| Polje | Opis |
| --- | --- |
| Glavni akter | Posjetitelj ili prijavljeni korisnik. |
| Oznake zahtjeva | F-001 |
| Preduvjeti | Prijava nije potrebna. |
| Glavni tijek | Korisnik otvara popis objava. Može unijeti pojam za pretraživanje i filtrirati objave prema vrsti, kategoriji, lokaciji i vremenu. Sustav prikazuje odgovarajuće rezultate. |
| Alternativni tijekovi | Ako nema odgovarajućih objava, sustav prikazuje obavijest, a korisnik može promijeniti kriterije. |
| Rezultat | Prikazane su odgovarajuće objave ili obavijest da nema rezultata. |

### UC-002: Pregledati detalje objave

| Polje | Opis |
| --- | --- |
| Glavni akter | Posjetitelj ili prijavljeni korisnik. |
| Oznake zahtjeva | F-002 |
| Preduvjeti | Objava je javno dostupna. Prijava nije potrebna. |
| Glavni tijek | Korisnik odabire objavu. Sustav prikazuje vrstu objave, kategoriju, naziv i opis predmeta, datum ili približno vrijeme događaja, status, lokaciju na karti te fotografiju ako je dodana. Skriveni detalj predmeta nije javno prikazan. |
| Alternativni tijekovi | Ako je objava uklonjena, sustav obavještava korisnika da nije dostupna. Ako kartu nije moguće učitati, prikazuju se ostali podaci uz obavijest o nedostupnosti karte. |
| Rezultat | Korisnik je pregledao javne podatke o predmetu. |

### UC-003: Prijaviti se

| Polje | Opis |
| --- | --- |
| Glavni akter | Posjetitelj ili administrator koji nije prijavljen. |
| Sporedni akter | Vanjski pružatelj identiteta. |
| Oznake zahtjeva | F-003 |
| Preduvjeti | Korisnik ima račun kod odabranog pružatelja identiteta. |
| Glavni tijek | 1. Korisnik odabire prijavu.<br>2. Sustav ga preusmjerava vanjskom pružatelju identiteta radi prijave putem OAuth 2.0.<br>3. Korisnik dovršava postupak prijave kod pružatelja.<br>4. Sustav provjerava odgovor pružatelja i uspostavlja korisničku sesiju. |
| Alternativni tijekovi | Ako korisnik odustane ili prijava ne uspije, ostaje neprijavljen i može koristiti javne funkcionalnosti. |
| Rezultat | Korisnik je prijavljen i dostupne su mu radnje prema dodijeljenoj ulozi. |

### UC-004: Objaviti izgubljeni ili pronađeni predmet

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik. |
| Sporedni akter | Vanjska usluga karata. |
| Oznake zahtjeva | F-004, F-005 |
| Preduvjeti | Korisnik je prijavljen. |
| Glavni tijek | 1. Korisnik otvara obrazac za novu objavu.<br>2. Unosi vrstu objave, kategoriju, naziv i opis predmeta te datum ili približno vrijeme događaja.<br>3. Određuje lokaciju GPS-om ili odabirom na karti.<br>4. Po želji dodaje fotografiju i skriveni detalj za provjeru vlasništva.<br>5. Potvrđuje objavu.<br>6. Sustav provjerava podatke, sprema objavu i prikazuje potvrdu. |
| Alternativni tijekovi | **GPS nije dostupan ili je dopuštenje odbijeno:** Korisnik odabire lokaciju na karti.<br>**Podaci su nepotpuni ili neispravni:** Sustav traži ispravak prije spremanja.<br>**Spremanje nije uspjelo:** Sustav prikazuje pogrešku i ne potvrđuje objavu. |
| Rezultat | Objava je dostupna za pregled, a skriveni detalj nije javno prikazan. |

### UC-005: Urediti vlastitu objavu

| Polje | Opis |
| --- | --- |
| Glavni akter | Autor objave. |
| Sporedni akter | Vanjska usluga karata pri promjeni lokacije. |
| Oznake zahtjeva | F-005, F-006 |
| Preduvjeti | Korisnik je prijavljen i autor je postojeće objave. |
| Glavni tijek | Korisnik odabire uređivanje svoje objave, mijenja podatke i potvrđuje spremanje. Sustav provjerava ovlasti i podatke te sprema izmjene. |
| Alternativni tijekovi | Ako podaci nisu valjani, sustav traži ispravak. Ako korisnik nije autor objave, sustav odbija uređivanje. |
| Rezultat | Objava je ažurirana, a skriveni detalj ostaje izvan javnog prikaza. |

### UC-006: Ukloniti vlastitu objavu

| Polje | Opis |
| --- | --- |
| Glavni akter | Autor objave. |
| Oznake zahtjeva | F-007 |
| Preduvjeti | Korisnik je prijavljen i autor je postojeće objave. |
| Glavni tijek | Korisnik odabire uklanjanje svoje objave i potvrđuje odluku. Sustav provjerava ovlasti i uklanja objavu iz javnog prikaza. |
| Alternativni tijekovi | Ako korisnik odustane, objava ostaje dostupna. Ako nije autor objave, sustav odbija uklanjanje. |
| Rezultat | Objava više nije javno dostupna. |

### UC-007: Zatražiti povrat predmeta

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik koji smatra da je vlasnik predmeta. |
| Oznake zahtjeva | F-008 |
| Preduvjeti | Korisnik je prijavljen, a objava pronađenog predmeta dostupna je za slanje zahtjeva. |
| Glavni tijek | 1. Korisnik otvara objavu i odabire slanje zahtjeva za povrat.<br>2. Navodi informacije kojima obrazlaže vlasništvo, uključujući obilježja predmeta koja nisu javno prikazana.<br>3. Šalje zahtjev.<br>4. Sustav sprema zahtjev i čini ga dostupnim autoru objave.<br>5. Korisniku se prikazuje potvrda i status zahtjeva koji čeka odluku. |
| Alternativni tijekovi | **Nedostaju obvezni podaci:** Sustav traži dopunu.<br>**Objava više nije dostupna za povrat:** Sustav ne sprema zahtjev i obavještava korisnika.<br>**Slanje nije uspjelo:** Sustav ne potvrđuje slanje i prikazuje pogrešku. |
| Rezultat | Zahtjev je poslan autoru objave. Njegov sadržaj nije javno dostupan. |

### UC-008: Prihvatiti ili odbiti zahtjev za povrat

| Polje | Opis |
| --- | --- |
| Glavni akter | Autor objave. |
| Oznake zahtjeva | F-009 |
| Preduvjeti | Autor je prijavljen i postoji zahtjev za njegovu objavu koji čeka odluku. |
| Glavni tijek | 1. Autor otvara zahtjev za povrat.<br>2. Pregledava navedene informacije i uspoređuje ih s obilježjima predmeta, uključujući skriveni detalj ako je zabilježen.<br>3. Procjenjuje zahtjev te ga prihvaća ili odbija.<br>4. Sustav sprema odluku i prikazuje ažurirani status autoru i podnositelju zahtjeva. |
| Alternativni tijekovi | **Nema dovoljno informacija:** Autor može privatnom porukom zatražiti dodatne informacije i odluku donijeti naknadno.<br>**Neovlašten pokušaj obrade:** Sustav odbija promjenu ako korisnik nije autor objave.<br>**Spremanje nije uspjelo:** Sustav ne potvrđuje promjenu statusa i prikazuje pogrešku. |
| Rezultat | Zahtjev je prihvaćen ili odbijen. Prihvaćanje zahtjeva ne znači da je fizička predaja predmeta već izvršena. |

### UC-009: Pratiti status zahtjeva

| Polje | Opis |
| --- | --- |
| Glavni akter | Podnositelj zahtjeva ili autor povezane objave. |
| Oznake zahtjeva | F-010 |
| Preduvjeti | Korisnik je prijavljen. |
| Glavni tijek | Korisnik otvara pregled poslanih ili primljenih zahtjeva. Sustav prikazuje zahtjeve u kojima korisnik sudjeluje i njihove aktualne statuse. |
| Alternativni tijekovi | Ako nema zahtjeva, sustav prikazuje odgovarajuću obavijest. Pristup tuđim zahtjevima nije dopušten. |
| Rezultat | Korisnik je upoznat sa statusom svojih poslanih ili primljenih zahtjeva. |

### UC-010: Razmjenjivati privatne poruke

| Polje | Opis |
| --- | --- |
| Glavni akter | Podnositelj zahtjeva ili autor povezane objave. |
| Oznake zahtjeva | F-011 |
| Preduvjeti | Korisnik je prijavljen i zahtjev za povrat već je poslan. Prihvaćanje zahtjeva nije uvjet za komunikaciju. |
| Glavni tijek | Korisnik otvara razgovor povezan sa zahtjevom, pregledava poruke i šalje novu poruku. Sustav je sprema i čini dostupnom drugom sudioniku radi provjere vlasništva ili dogovora o preuzimanju. |
| Alternativni tijekovi | Sustav odbija pristup korisniku koji nije sudionik razgovora. Ako slanje ne uspije, poruka se ne prikazuje kao uspješno poslana. |
| Rezultat | Sudionici mogu privatno razmjenjivati informacije bez javnog objavljivanja kontaktnih podataka. |

### UC-011: Pregledati moguća podudaranja

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik. |
| Oznake zahtjeva | F-012 |
| Preduvjeti | Korisnik je prijavljen i ima objavu za koju se traže podudaranja. |
| Glavni tijek | Korisnik otvara moguća podudaranja za svoju objavu. Sustav prikazuje prijedloge na temelju kategorije, opisa, vremena i lokacije. Korisnik može otvoriti detalje predložene objave. |
| Alternativni tijekovi | Ako nema mogućih podudaranja, sustav prikazuje odgovarajuću obavijest. |
| Rezultat | Korisnik je pregledao prijedloge. Podudaranje ne predstavlja potvrdu vlasništva. |

### UC-012: Uključiti obavijesti i pregledati obavijesti o podudaranjima

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik koji je objavio izgubljeni predmet. |
| Oznake zahtjeva | F-013 |
| Preduvjeti | Korisnik je prijavljen i ima objavu izgubljenog predmeta. |
| Glavni tijek | Korisnik uključuje obavijesti o mogućim podudaranjima. Kada nova objava odgovara njegovoj objavi prema kriterijima podudaranja, sustav prikazuje obavijest u aplikaciji. Korisnik otvara obavijest i povezanu objavu. |
| Alternativni tijekovi | Ako obavijesti nisu uključene ili nema novih podudaranja, sustav ne stvara novu obavijest. Ako povezana objava više nije dostupna, sustav o tome obavještava korisnika. |
| Rezultat | Korisniku koji je uključio obavijesti dostupne su obavijesti o novim mogućim podudaranjima. |

### UC-013: Prijaviti problematičnu objavu

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik. |
| Oznake zahtjeva | F-014 |
| Preduvjeti | Korisnik je prijavljen. Objava je dostupna. |
| Glavni tijek | Korisnik odabire prijavu objave, navodi razlog i šalje prijavu. Sustav je sprema i čini dostupnom administratoru. |
| Alternativni tijekovi | Ako razlog nije naveden, sustav traži dopunu. Ako je objava u međuvremenu uklonjena, sustav obavještava korisnika. |
| Rezultat | Prijava je dostupna administratoru. Objava se ne uklanja automatski samim slanjem prijave. |

### UC-014: Pregledati prijave i ukloniti neprimjeren sadržaj

| Polje | Opis |
| --- | --- |
| Glavni akter | Administrator. |
| Oznake zahtjeva | F-015 |
| Preduvjeti | Administrator je prijavljen i ima administratorske ovlasti. |
| Glavni tijek | Administrator otvara prijavu, pregledava razlog i povezanu objavu. Ako procijeni da je sadržaj neprimjeren, odabire i potvrđuje uklanjanje. Sustav uklanja objavu iz javnog prikaza. |
| Alternativni tijekovi | Ako prijava nije opravdana, objava ostaje dostupna. Ako nema prijava ili je objava već uklonjena, sustav prikazuje odgovarajuću obavijest. Sustav odbija pristup korisnicima bez administratorskih ovlasti. |
| Rezultat | Prijava je pregledana, a neprimjeren sadržaj uklonjen ako je administrator procijenio da je uklanjanje opravdano. |
---

## 3.3 Use Case Consistency Check

Sljedeća pitanja služe timu za provjeru usklađenosti slučajeva uporabe, zahtjeva i aplikacije.

| Provjera | Pitanje za tim |
| --- | --- |
| Povezanost sa zahtjevima | Ima li svaki slučaj uporabe od UC-001 do UC-014 navedene odgovarajuće oznake zahtjeva iz drugog dokumenta? |
| Javni pristup | Mogu li posjetitelji bez prijave pregledavati, pretraživati i filtrirati objave te pregledavati njihove detalje, kako opisuju UC-001 i UC-002? |
| Ovlasti korisnika | Dopuštaju li UC-005 i UC-006 uređivanje i uklanjanje objave samo njezinu autoru, a UC-008 obradu zahtjeva samo autoru povezane objave? |
| Provjera vlasništva | Ostaje li skriveni detalj nejavan u UC-002 i koristi li se za procjenu vlasništva u postupku opisanom u UC-007 i UC-008? |
| Privatna komunikacija | Je li razgovor u UC-010 dostupan samo sudionicima nakon slanja zahtjeva, bez obveznog prethodnog prihvaćanja? |
| Prijavljivanje i moderiranje | Je li prijavljivanje objava u UC-013 dostupno samo prijavljenim korisnicima, a moderiranje u UC-014 samo administratoru? |
| Alternativni tijekovi | Omogućuje li UC-004 ručni odabir lokacije kada GPS nije dostupan i sprječava li spremanje nepotpunih podataka? |
| Provjera u aplikaciji | Može li tim demonstrirati opisane glavne i alternativne tijekove ili su oni još označeni kao planirano ponašanje? |
