# 3. Use Cases
## 3.1 Use Case Diagram

![Dijagram slučajeva uporabe Lost & Found](./assets/diagrams/lostAndFound.svg)

**PlantUML izvor:** [Izvorni kod dijagrama](./puml/lost-and-found-UC.puml)

## 3.2 Use Case Descriptions

### UC-001: Pregledati, pretražiti i filtrirati objave

| Polje | Opis |
| --- | --- |
| Glavni akter | Posjetitelj ili prijavljeni korisnik. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Prijava nije potrebna. |
| Glavni tijek | Korisnik otvara popis objava. Može unijeti pojam za pretraživanje i filtrirati objave prema vrsti, kategoriji, lokaciji i vremenu. Sustav prikazuje odgovarajuće rezultate. |
| Alternativni tijekovi | Ako nema odgovarajućih objava, sustav prikazuje obavijest, a korisnik može promijeniti kriterije. |
| Rezultat | Prikazane su odgovarajuće objave ili obavijest da nema rezultata. |

### UC-002: Pregledati detalje objave

| Polje | Opis |
| --- | --- |
| Glavni akter | Posjetitelj ili prijavljeni korisnik. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Objava je javno dostupna. Prijava nije potrebna. |
| Glavni tijek | Korisnik odabire objavu. Sustav prikazuje vrstu objave, kategoriju, naziv i opis predmeta, datum ili približno vrijeme događaja, status, lokaciju na karti te fotografiju ako je dodana. Skriveni detalj predmeta nije javno prikazan. |
| Alternativni tijekovi | Ako je objava uklonjena, sustav obavještava korisnika da nije dostupna. Ako kartu nije moguće učitati, prikazuju se ostali podaci uz obavijest o nedostupnosti karte. |
| Rezultat | Korisnik je pregledao javne podatke o predmetu. |

### UC-003: Prijaviti se

| Polje | Opis |
| --- | --- |
| Glavni akter | Posjetitelj ili administrator koji nije prijavljen. |
| Sporedni akter | Vanjski pružatelj identiteta. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik ima račun kod odabranog pružatelja identiteta. |
| Glavni tijek | 1. Korisnik odabire prijavu.<br>2. Sustav ga preusmjerava vanjskom pružatelju identiteta radi prijave putem OAuth 2.0.<br>3. Korisnik dovršava postupak prijave kod pružatelja.<br>4. Sustav provjerava odgovor pružatelja i uspostavlja korisničku sesiju. |
| Alternativni tijekovi | Ako korisnik odustane ili prijava ne uspije, ostaje neprijavljen i može koristiti javne funkcionalnosti. |
| Rezultat | Korisnik je prijavljen i dostupne su mu radnje prema dodijeljenoj ulozi. |

### UC-004: Objaviti izgubljeni ili pronađeni predmet

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik. |
| Sporedni akter | Vanjska usluga karata. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik je prijavljen. |
| Glavni tijek | 1. Korisnik otvara obrazac za novu objavu.<br>2. Unosi vrstu objave, kategoriju, naziv i opis predmeta te datum ili približno vrijeme događaja.<br>3. Određuje lokaciju GPS-om ili odabirom na karti.<br>4. Po želji dodaje fotografiju i skriveni detalj za provjeru vlasništva.<br>5. Potvrđuje objavu.<br>6. Sustav provjerava podatke, sprema objavu i prikazuje potvrdu. |
| Alternativni tijekovi | **GPS nije dostupan ili je dopuštenje odbijeno:** Korisnik odabire lokaciju na karti.<br>**Podaci su nepotpuni ili neispravni:** Sustav traži ispravak prije spremanja.<br>**Spremanje nije uspjelo:** Sustav prikazuje pogrešku i ne potvrđuje objavu. |
| Rezultat | Objava je dostupna za pregled, a skriveni detalj nije javno prikazan. |

### UC-005: Urediti vlastitu objavu

| Polje | Opis |
| --- | --- |
| Glavni akter | Autor objave. |
| Sporedni akter | Vanjska usluga karata pri promjeni lokacije. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik je prijavljen i autor je postojeće objave. |
| Glavni tijek | Korisnik odabire uređivanje svoje objave, mijenja podatke i potvrđuje spremanje. Sustav provjerava ovlasti i podatke te sprema izmjene. |
| Alternativni tijekovi | Ako podaci nisu valjani, sustav traži ispravak. Ako korisnik nije autor objave, sustav odbija uređivanje. |
| Rezultat | Objava je ažurirana, a skriveni detalj ostaje izvan javnog prikaza. |

### UC-006: Ukloniti vlastitu objavu

| Polje | Opis |
| --- | --- |
| Glavni akter | Autor objave. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik je prijavljen i autor je postojeće objave. |
| Glavni tijek | Korisnik odabire uklanjanje svoje objave i potvrđuje odluku. Sustav provjerava ovlasti i uklanja objavu iz javnog prikaza. |
| Alternativni tijekovi | Ako korisnik odustane, objava ostaje dostupna. Ako nije autor objave, sustav odbija uklanjanje. |
| Rezultat | Objava više nije javno dostupna. |

### UC-007: Zatražiti povrat predmeta

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik koji smatra da je vlasnik predmeta. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik je prijavljen, a objava pronađenog predmeta dostupna je za slanje zahtjeva. |
| Glavni tijek | 1. Korisnik otvara objavu i odabire slanje zahtjeva za povrat.<br>2. Navodi informacije kojima obrazlaže vlasništvo, uključujući obilježja predmeta koja nisu javno prikazana.<br>3. Šalje zahtjev.<br>4. Sustav sprema zahtjev i čini ga dostupnim autoru objave.<br>5. Korisniku se prikazuje potvrda i status zahtjeva koji čeka odluku. |
| Alternativni tijekovi | **Nedostaju obvezni podaci:** Sustav traži dopunu.<br>**Objava više nije dostupna za povrat:** Sustav ne sprema zahtjev i obavještava korisnika.<br>**Slanje nije uspjelo:** Sustav ne potvrđuje slanje i prikazuje pogrešku. |
| Rezultat | Zahtjev je poslan autoru objave. Njegov sadržaj nije javno dostupan. |

### UC-008: Prihvatiti ili odbiti zahtjev za povrat

| Polje | Opis |
| --- | --- |
| Glavni akter | Autor objave. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Autor je prijavljen i postoji zahtjev za njegovu objavu koji čeka odluku. |
| Glavni tijek | 1. Autor otvara zahtjev za povrat.<br>2. Pregledava navedene informacije i uspoređuje ih s obilježjima predmeta, uključujući skriveni detalj ako je zabilježen.<br>3. Procjenjuje zahtjev te ga prihvaća ili odbija.<br>4. Sustav sprema odluku i prikazuje ažurirani status autoru i podnositelju zahtjeva. |
| Alternativni tijekovi | **Nema dovoljno informacija:** Autor može privatnom porukom zatražiti dodatne informacije i odluku donijeti naknadno.<br>**Neovlašten pokušaj obrade:** Sustav odbija promjenu ako korisnik nije autor objave.<br>**Spremanje nije uspjelo:** Sustav ne potvrđuje promjenu statusa i prikazuje pogrešku. |
| Rezultat | Zahtjev je prihvaćen ili odbijen. Prihvaćanje zahtjeva ne znači da je fizička predaja predmeta već izvršena. |

### UC-009: Pratiti status zahtjeva

| Polje | Opis |
| --- | --- |
| Glavni akter | Podnositelj zahtjeva ili autor povezane objave. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik je prijavljen. |
| Glavni tijek | Korisnik otvara pregled poslanih ili primljenih zahtjeva. Sustav prikazuje zahtjeve u kojima korisnik sudjeluje i njihove aktualne statuse. |
| Alternativni tijekovi | Ako nema zahtjeva, sustav prikazuje odgovarajuću obavijest. Pristup tuđim zahtjevima nije dopušten. |
| Rezultat | Korisnik je upoznat sa statusom svojih poslanih ili primljenih zahtjeva. |

### UC-010: Razmjenjivati privatne poruke

| Polje | Opis |
| --- | --- |
| Glavni akter | Podnositelj zahtjeva ili autor povezane objave. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik je prijavljen i zahtjev za povrat već je poslan. Prihvaćanje zahtjeva nije uvjet za komunikaciju. |
| Glavni tijek | Korisnik otvara razgovor povezan sa zahtjevom, pregledava poruke i šalje novu poruku. Sustav je sprema i čini dostupnom drugom sudioniku radi provjere vlasništva ili dogovora o preuzimanju. |
| Alternativni tijekovi | Sustav odbija pristup korisniku koji nije sudionik razgovora. Ako slanje ne uspije, poruka se ne prikazuje kao uspješno poslana. |
| Rezultat | Sudionici mogu privatno razmjenjivati informacije bez javnog objavljivanja kontaktnih podataka. |

### UC-011: Pregledati moguća podudaranja

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik je prijavljen i ima objavu za koju se traže podudaranja. |
| Glavni tijek | Korisnik otvara moguća podudaranja za svoju objavu. Sustav prikazuje prijedloge na temelju kategorije, opisa, vremena i lokacije. Korisnik može otvoriti detalje predložene objave. |
| Alternativni tijekovi | Ako nema mogućih podudaranja, sustav prikazuje odgovarajuću obavijest. |
| Rezultat | Korisnik je pregledao prijedloge. Podudaranje ne predstavlja potvrdu vlasništva. |

### UC-012: Uključiti obavijesti i pregledati obavijesti o podudaranjima

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik koji je objavio izgubljeni predmet. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik je prijavljen i ima objavu izgubljenog predmeta. |
| Glavni tijek | Korisnik uključuje obavijesti o mogućim podudaranjima. Kada nova objava odgovara njegovoj objavi prema kriterijima podudaranja, sustav prikazuje obavijest u aplikaciji. Korisnik otvara obavijest i povezanu objavu. |
| Alternativni tijekovi | Ako obavijesti nisu uključene ili nema novih podudaranja, sustav ne stvara novu obavijest. Ako povezana objava više nije dostupna, sustav o tome obavještava korisnika. |
| Rezultat | Korisniku koji je uključio obavijesti dostupne su obavijesti o novim mogućim podudaranjima. |

### UC-013: Prijaviti problematičnu objavu

| Polje | Opis |
| --- | --- |
| Glavni akter | Prijavljeni korisnik. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Korisnik je prijavljen. Objava je dostupna. |
| Glavni tijek | Korisnik odabire prijavu objave, navodi razlog i šalje prijavu. Sustav je sprema i čini dostupnom administratoru. |
| Alternativni tijekovi | Ako razlog nije naveden, sustav traži dopunu. Ako je objava u međuvremenu uklonjena, sustav obavještava korisnika. |
| Rezultat | Prijava je dostupna administratoru. Objava se ne uklanja automatski samim slanjem prijave. |

### UC-014: Pregledati prijave i ukloniti neprimjeren sadržaj

| Polje | Opis |
| --- | --- |
| Glavni akter | Administrator. |
| Oznake zahtjeva | Naknadno povezati. |
| Preduvjeti | Administrator je prijavljen i ima administratorske ovlasti. |
| Glavni tijek | Administrator otvara prijavu, pregledava razlog i povezanu objavu. Ako procijeni da je sadržaj neprimjeren, odabire i potvrđuje uklanjanje. Sustav uklanja objavu iz javnog prikaza. |
| Alternativni tijekovi | Ako prijava nije opravdana, objava ostaje dostupna. Ako nema prijava ili je objava već uklonjena, sustav prikazuje odgovarajuću obavijest. Sustav odbija pristup korisnicima bez administratorskih ovlasti. |
| Rezultat | Prijava je pregledana, a neprimjeren sadržaj uklonjen ako je administrator procijenio da je uklanjanje opravdano. |
---

## 3.3 Use Case Consistency Check

**Objective:** Check that use cases, actors, and requirements agree with one another and with the application the team demonstrates.

| Check | Question for the team |
| --- | --- |
| Requirement | Does each important use case link to an existing requirement? |
| Actor | Does the actor here match an identified role and its permitted interaction? |
| Application | Can the team demonstrate the described main result and important alternative, or is the description marked as a current design? |

---

Maintain the requirement-to-use-case-to-test mapping **once, in the [requirement traceability table](./2.-Requirements)**. Do not maintain a second project mapping or an implementation-status column here. If an important requirement has no interaction with a human actor, explain where it is addressed instead of inventing an actor.

<details>
<summary><strong>Checking requirement coverage</strong></summary>

**Example — a use-case coverage table to examine:**

| Use Case Number | Use Case Name | Functional Requirements Covered |
| --- | --- | --- |
| UC-001 | Register account | F-001: Account registration by email |
| UC-002 | Disaster Reporting | F-022: Disaster event reporting and validation |
| UC-003 | Emergency Alert System | F-045: Sending alerts to users and teams |
| UC-004 | Rescue Coordination | F-067: Coordinating with emergency services |

---

**Coverage issues to resolve:** 

- **Wrong requirement ID:** this table links UC-002 to F-022, but the UC-002 description in 3.2 cites F-004, the report-submission requirement in 2.1.
- **Requirements that do not exist:** F-022, F-045, and F-067 are not defined in the example requirements in 2.1.
- **Use cases without descriptions:** UC-003 and UC-004 have no description in 3.2. UC-004 (coordinating with emergency services) is also a capability with external consequences, which the scope allows only if the approved task includes it.
- **Actor mismatch:** the actor example in 2.3 has the Disaster Manager submitting reports (F-004), while UC-002 has a Citizen submitting them.


</details>
