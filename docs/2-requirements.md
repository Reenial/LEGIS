# 2. Requirement Analysis

Zahtjevi aplikacije **Lost & Found** temelje se na [projektnom zadatku](./assets/Lost_and_Found_Projektni_zadatak_261012_155026.pdf) (odjeljci 1–3), [opsegu projekta](./1-Project-Scope.md) i [slučajevima uporabe](./3-use-cases.md). Svaki ima oznaku, prioritet i kriterij prihvaćanja. Značajne promjene bilježe se u odjeljku 2.5.

**High** označava osnovne funkcionalnosti i zaštitu podataka, a **Medium** podudaranja i obavijesti. Svi zahtjevi ostaju u opsegu, neovisno o prioritetu.

## 2.1 Functional Requirements

| ID | Description | Priority | Source | Acceptance criteria |
| --- | --- | --- | --- | --- |
| F-001 | Sustav omogućuje pregled i pretraživanje objava bez prijave te filtriranje prema vrsti, kategoriji, lokaciji i vremenu. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Korisnik odabire ponuđene ključne riječi za predmet koji traži; ako odgovarajuće nema, unosi vlastiti tekst pod „ostalo”. Kombinirani kriteriji vraćaju samo odgovarajuće objave; ako ih nema, prikazuje se obavijest i omogućuje promjena kriterija. |
| F-002 | Sustav prikazuje javne podatke objave i lokaciju na karti. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Dostupni su vrsta, kategorija, naziv, opis, datum ili približno vrijeme, status povrata, lokacija i fotografija ako postoji. Vrsta objave je „izgubljeno” ili „pronađeno”; status „na čekanju” znači da je predmet pronađen, ali nije uručen, a „predano” da ga je pronalazitelj označio predanim. Predana objava ostaje javno vidljiva sedam dana od označavanja statusom „predano”, radi mogućeg javljanja drugog vlasnika; nakon tog roka više se ne prikazuje javno. Skriveni detalj nije dostupan javnosti; uklonjena objava prikazuje se kao nedostupna. |
| F-003 | Sustav omogućuje prijavu preko vanjskog pružatelja identiteta putem OAuth 2.0. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Uspješna provjera odgovora pružatelja uspostavlja sesiju i dopušta radnje prema ulozi. Odustajanje ili neuspjeh ne daje pristup zaštićenim radnjama; javni pregled ostaje dostupan. |
| F-004 | Prijavljeni korisnik može objaviti izgubljeni ili pronađeni predmet. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Spremaju se vrsta, kategorija, naziv, opis, datum ili približno vrijeme te lokacija; fotografija i skriveni detalj su neobvezni. Pri opisu predmeta korisnik odabire ponuđene ključne riječi, a ako odgovarajuće nema, upisuje vlastiti tekst pod „ostalo”; odabir i unos spremaju se uz objavu. Nepotpuni ili neispravni obvezni podaci traže ispravak i ne stvaraju objavu. |
| F-005 | Korisnik može odrediti lokaciju GPS-om ili ručnim odabirom na karti. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Odabrana lokacija sprema se uz objavu i prikazuje u detaljima; odbijeno dopuštenje ili nedostupan GPS ne sprječava ručni odabir. |
| F-006 | Autor može urediti vlastitu objavu. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Valjane izmjene autora vidljive su nakon ponovnog otvaranja; nevaljane izmjene i pokušaji drugog korisnika odbijaju se bez promjene podataka. Skriveni detalj ostaje nejavan. |
| F-007 | Autor može ukloniti vlastitu objavu iz javnog prikaza. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Potvrđeno uklanjanje čini objavu javno nedostupnom; odustajanje je ne mijenja. Drugi korisnik ne može ukloniti objavu ovom radnjom. |
| F-008 | Prijavljeni korisnik može poslati zahtjev za povrat dostupnog pronađenog predmeta uz obrazloženje vlasništva. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Valjan zahtjev dostupan je autoru i podnositelju sa statusom čekanja odluke; nije javan. Nedostatak obveznih informacija ili nedostupna objava sprječava spremanje. Podnositelj može povući svoj zahtjev; povlačenje se prikazuje obama sudionicima. |
| F-009 | Autor povezane objave može pregledati informacije iz zahtjeva, usporediti obilježja sa skrivenim detaljem ako postoji te prihvatiti ili odbiti zahtjev. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Samo autor donosi i može promijeniti odluku; aktualni status vide oba sudionika. Prihvaćanje ne označava automatski izvršenu fizičku predaju; pronalazitelj zasebno označava predmet predanim. |
| F-010 | Sudionici mogu pregledati svoje poslane i primljene zahtjeve te njihove statuse. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Pregled sadrži samo zahtjeve u kojima korisnik sudjeluje i aktualne statuse; prazan pregled ima odgovarajuću obavijest. Izravan pristup tuđem zahtjevu odbija se. |
| F-011 | Autor objave i podnositelj poslanog zahtjeva mogu razmjenjivati privatne poruke radi provjere vlasništva i dogovora predaje. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Poruka je nakon spremanja dostupna drugom sudioniku; razgovor je dostupan i prije prihvaćanja zahtjeva. Treća osoba ne može čitati ni slati poruke u tom razgovoru. Nakon uklanjanja objave postojeći razgovor ostaje dostupan njegovim sudionicima. |
| F-012 | Prijavljeni korisnik može pregledati moguće podudaranje za svoju objavu prema omjeru ključnih riječi izgubljenog i pronađenog predmeta, uz podatke o kategoriji, vremenu i lokaciji za filtriranje i pregled. | Medium | Projektni zadatak, odjeljak 2; razrada u 2.5. | Prikazuju se objave s najmanje 80 % podudaranja prema C-07. Ako ih nema, prikazuje se najviše pet najsličnijih, silazno po postotku; ako nema kandidata, prikazuje se obavijest. Prijedlozi vode na detalje i nisu potvrda vlasništva. |
| F-013 | Korisnik može jednom uključiti ili isključiti obavijesti u aplikaciji za cijeli račun; postavka vrijedi za nova moguća podudaranja svih njegovih izgubljenih predmeta, nove privatne poruke i promjene statusa zahtjeva. | Medium | Projektni zadatak, odjeljak 2; razrada u 2.5. | Postavka se sprema uz račun. Kad je uključena, novo podudaranje, poruka ili promjena statusa stvara obavijest za odgovarajućeg korisnika s poveznicom na povezani sadržaj. Bez uključivanja ili relevantnog događaja nema nove obavijesti; uklonjen sadržaj označen je nedostupnim. |
| F-014 | Prijavljeni korisnik može prijaviti problematičnu objavu uz navođenje razloga. | High | Projektni zadatak, odjeljak 2; dogovor tima 28. listopada 2026. | Prijava s razlogom postaje dostupna administratoru; prazan razlog traži dopunu. Neprijavljenom korisniku slanje prijave nije dopušteno. Sama prijava ne uklanja objavu. |
| F-015 | Administrator može pregledati prijave i ukloniti neprimjerenu objavu. | High | Projektni zadatak, odjeljak 2; razrada u 2.5. | Administrator vidi razlog i povezanu objavu; potvrđeno uklanjanje čini je javno nedostupnom. Neopravdana prijava ne zahtijeva uklanjanje. Korisnik bez administratorske uloge ne može pristupiti moderiranju. |

## 2.2 Non-Functional Requirements

Navedene provjere predstavljaju očekivane kriterije kvalitete. Rezultati provjera bilježe se u poglavlju o testiranju.

| ID | Description | Priority | Source |
| --- | --- | --- | --- |
| NF-001 | Skriveni detalji predmeta, sadržaj zahtjeva i privatne poruke ne smiju biti dostupni neovlaštenim korisnicima ni kroz sučelje ni izravnim zahtjevom poslužitelju. Provjera: usporediti pristup autora, sudionika, trećeg korisnika i neprijavljenog posjetitelja. | High | Projektni zadatak odjeljci 1–2; Opseg, odjeljak 1.1 i odjeljak 1.3; UC-002, UC-007–UC-010. |
| NF-002 | Poslužitelj mora provjeriti identitet i ovlasti pri svakoj zaštićenoj radnji. Provjera: bez sesije, s nevaljanom sesijom i kao drugi korisnik pokušati uređivanje, uklanjanje, obradu zahtjeva i moderiranje; pristup se odbija bez promjene podataka. | High | UC-003, UC-005, UC-006, UC-008, UC-014; razrada ograničenja pristupa. |
| NF-003 | Osnovni pregled, pretraživanje, objava i slanje zahtjeva moraju biti uporabivi u mobilnom pregledniku. Provjera: na širini prikaza 360 px svi potrebni unosi i radnje dostupni su bez vodoravnog pomicanja stranice. | High | Projektni zadatak, odjeljak 3; Opseg, odjeljak 1.3. |
| NF-004 | Odbijanje dopuštenja za GPS ne smije onemogućiti objavu: korisnik može ručno odabrati lokaciju. Ako se karta u detaljima ne učita, ostali javni podaci ostaju vidljivi uz obavijest o nedostupnoj karti. | High | Projektni zadatak, odjeljak 2; Opseg, odjeljak 1.3; UC-002, UC-004. |
| NF-005 | Neuspjelo spremanje objave, zahtjeva, odluke ili poruke mora dati vidljivu pogrešku bez lažne potvrde uspjeha. Provjera: izazvati neuspjeh spremanja u testnom okruženju za svaku navedenu radnju i provjeriti poruku te pohranjeno stanje. | High | Alternativni tijekovi UC-004, UC-007, UC-008, UC-010. |

Numerički ciljevi odziva, broja istodobnih korisnika i dostupnosti nisu utvrđeni u postojećim izvorima; ne preuzimaju se vrijednosti iz nastavnih primjera.

## 2.3 Stakeholders and Actors

| Role or actor ID | Relation to the system | Relevant requirements |
| --- | --- | --- |
| A-01 Posjetitelj | Neprijavljeni korisnik pregledava javne objave i pokreće prijavu. | F-001–F-003 |
| A-02 Prijavljeni korisnik | Student ili zaposlenik; ovisno o radnji nastupa kao autor objave, pronalazitelj ili podnositelj zahtjeva. Autor i podnositelj nisu zasebne trajne uloge računa. | F-001–F-014; NF-001–NF-005. |
| A-03 Administrator | Prijavljuje se, pregledava prijave i uklanja neprimjeren sadržaj. Administratorska uloga sama po sebi ne daje pristup privatnim razgovorima. | F-003, F-015; NF-001, NF-002. |
| A-04 Vanjski pružatelj identiteta | Vanjski sustav sudjeluje u prijavi korisnika. | F-003; NF-002. |
| A-05 Usluga karata | Vanjski sustav omogućuje prikaz i odabir lokacije. GPS ovisi i o pregledniku odnosno uređaju. | F-002, F-005; NF-004. |
| S-01 Projektni tim | Dionik odgovoran za razvoj i usklađivanje zahtjeva; nema posebnu aplikacijsku ulogu. | Svi zahtjevi. |
| S-02 Nastavno osoblje kolegija | Dionik koji prati i vrednuje projekt; nema posebnu aplikacijsku ulogu. | Opseg projekta i provjerljivost zahtjeva. |

Izvori: Opseg, odjeljak 1.2 i dijagram te opisi slučajeva uporabe.

## 2.4 Constraints and Assumptions

| ID | Constraint or assumption | Source | Consequence or way to verify |
| --- | --- | --- | --- |
| C-01 | Prijava se ostvaruje preko vanjskog pružatelja identiteta putem OAuth 2.0. | Projektni zadatak, odjeljak 2; Opseg, odjeljak 1.3; UC-003. | Tim odabire pružatelja tijekom projektiranja; provjeriti uspješnu, otkazanu i neuspjelu prijavu. |
| C-02 | Lokacija ovisi o vanjskoj usluzi karata; GPS ovisi o uređaju i dopuštenju korisnika. | Projektni zadatak odjeljci 2–3; Opseg, odjeljak 1.3. | Osigurati ručni odabir lokacije i provjeriti uskraćeno GPS dopuštenje te nedostupnost karte prema NF-004. |
| C-03 | Predaja, dostava i fizičko čuvanje predmeta izvan su sustava. | Projektni zadatak, odjeljak 2; Opseg, odjeljak 1.3; UC-008, UC-010. | Sustav omogućuje dogovor; prihvaćen zahtjev nije dokaz izvršene predaje. |
| C-04 | Sustav pomaže u procjeni vlasništva, ali ga ne jamči. | Opseg odjeljak 1.1 i odjeljak 1.3; UC-011. | Odluku o zahtjevu donosi autor objave; prijedlog podudaranja nije potvrda vlasništva. |
| C-05 | Razvija se web-aplikacija prilagođena mobilnim uređajima, bez zasebne mobilne aplikacije. | Projektni zadatak, odjeljak 3; Opseg, odjeljak 1.3. | Provjeriti mobilni prikaz prema NF-003. |
| C-06 | Prijavljivanje problematičnih objava dostupno je i bez korisničke prijave. | Potvrda pri razradi zahtjeva, 27. listopada 2026. | Provjeriti slanje prijave kao posjetitelj; UC-013 treba uskladiti s ovom odlukom. |
| C-07 | Podudaranje ključnih riječi računa se kao broj zajedničkih različitih ključnih riječi podijeljen brojem svih različitih ključnih riječi iz obaju skupova, pomnožen sa 100. | Razrada omjera ključnih riječi dogovorenog u razgovoru, 27. listopada 2026. | Četiri zajedničke od pet različitih riječi daju 80 %. Zanemaruju se ponavljanja, veličina slova i rubni razmaci; prazan skup daje 0 %. Unos „ostalo” uspoređuje se kao oznaka bez prepoznavanja sinonima. Kategorija, vrijeme i lokacija služe filtriranju, ne izračunu postotka. |
| AS-02 | Odabir najsličnijih predmeta slijedi F-012 i formulu C-07. | Razrada zahtjeva, odjeljak 2.5. | Provjeriti prag 80 % i ograničenje na pet zamjenskih prijedloga. |
| AS-03 | Odabrane vanjske usluge bit će dostupne u razvojnom i demonstracijskom okruženju. | Vanjske ovisnosti iz opsega odjeljak 1.3. | Provjeriti konfiguraciju, uvjete korištenja i dostupnost pri integraciji; trenutačni izvori ne određuju pružatelje ni jamstva dostupnosti. |

## 2.5 Significant Requirement Changes

U nastavku su zabilježene značajne dopune zahtjeva tijekom njihove razrade.

| Date | Requirement ID | Change and reason | Agreed with / evidence |
| --- | --- | --- | --- |
| 2026-10-27 | F-001, F-004, F-012, C-07 | Dodane ključne riječi i unos „ostalo”; razrađeno podudaranje od 80 % uz najviše pet zamjenskih prijedloga. | Razrada zahtjeva; formula konkretizira predloženi omjer riječi. |
| 2026-10-27 | F-002, F-008, F-009 | Razrađeni statusi povrata, povlačenje zahtjeva i promjena odluke; predana objava ostaje vidljiva sedam dana. | Razrada zahtjeva. |
| 2026-10-27 | F-011, F-013, F-014 | Razgovori ostaju dostupni nakon uklanjanja objave; obavijesti vrijede za cijeli račun;| Razrada zahtjeva. |
| 2026-10-28 | F-014, C-06 | Određeno je da samo prijavljeni korisnici mogu prijavljivati problematične objave. | Dogovor projektnog tima. |

Ključne riječi i unos „ostalo” koriste se pri objavi i traženju predmeta. Tim periodično pregledava unose „ostalo” radi poboljšanja filtara; automatsko dodavanje riječi nije zahtjev. Pravila za višestruke zahtjeve i zahtjeve za vlastitu objavu još nisu definirana.

## 2.6 Requirement Traceability

Slučajevi uporabe povezani su u nastavku. Sve navedene provjere su **planirane, nisu izvršene**. Projektne testove i ručne postupke treba dokumentirati u [odjeljku 5.2](./5-Testing.md#52-test-cases), a rezultate u odjeljku 5.3. Nastavni primjeri u tom poglavlju nisu projektni testovi.

| Requirement ID | Use case or design location | Test or verification location |
| --- | --- | --- |
| F-001 | UC-001 — [opis](./3-use-cases.md). | Pretraga s kombiniranim filtrima, ponuđenim ključnim riječima i unosom „ostalo”; prazan rezultat. |
| F-002 | UC-002 — [opis](./3-use-cases.md). | Javni detalji, neobvezna fotografija i skriveni detalj; vidljivost predane objave prije i nakon isteka sedam dana; uklonjena objava. |
| F-003 | UC-003 — [opis](./3-use-cases.md). | Uspješna, otkazana i neuspjela OAuth prijava. |
| F-004 | UC-004 — [opis](./3-use-cases.md). | Valjana objava obiju vrsta s odabranim ključnim riječima i unosom „ostalo”; nedostatak obveznih podataka. |
| F-005 | UC-004, UC-005 — [opis](./3-use-cases.md). | GPS i ručni odabir; provjera spremljene lokacije. |
| F-006 | UC-005 — [opis](./3-use-cases.md). | Uređivanje kao autor i kao drugi korisnik; nevaljani podaci. |
| F-007 | UC-006 — [opis](./3-use-cases.md). | Potvrđeno i otkazano uklanjanje te pokušaj drugog korisnika. |
| F-008 | UC-007 — [opis](./3-use-cases.md). | Valjan, nepotpun i povučen zahtjev; nedostupna objava; privatnost. |
| F-009 | UC-008 — [opis](./3-use-cases.md). | Prihvaćanje, odbijanje i promjena odluke; neovlašten pokušaj. |
| F-010 | UC-009 — [opis](./3-use-cases.md). | Poslani i primljeni zahtjevi, prazan popis i pristup tuđem zahtjevu. |
| F-011 | UC-010 — [opis](./3-use-cases.md). | Razgovor prije prihvaćanja i nakon uklanjanja objave; poruke i zabrana pristupa trećoj osobi. |
| F-012 | UC-011 — [opis](./3-use-cases.md). | Prag ispod, na i iznad 80 %; najviše pet zamjenskih prijedloga; ponavljanja, veličina slova i prazni skupovi prema C-07. |
| F-013 | UC-012 — [opis](./3-use-cases.md). | Uključivanje i isključivanje za cijeli račun; podudaranja, poruke i statusi; nedostupna poveznica. |
| F-014 | UC-013 — [opis](./3-use-cases.md). | Slanje prijave kao prijavljeni korisnik; odbijanje slanja bez prijave; obvezan razlog; izostanak automatskog uklanjanja objave. |
| F-015 | UC-014 — [opis](./3-use-cases.md). | Moderiranje kao administrator i obični korisnik; opravdana i neopravdana prijava. |
| NF-001 | UC-002, UC-007–UC-010. | Provjeriti javne odgovore i pristup privatnim podacima s četiri vrste identiteta. |
| NF-002 | UC-003, UC-005, UC-006, UC-008, UC-014. | Izravni neovlašteni zahtjevi i provjera nepromijenjenih podataka. |
| NF-003 | Projektni zadatak, odjeljak 3; Opseg, odjeljak 1.3; UC-001, UC-004, UC-007. | Proći osnovne radnje na širini 360 px; potvrđeni kriterij mobilnog prikaza. |
| NF-004 | UC-002, UC-004. | Uskratiti GPS dopuštenje i ručno odabrati lokaciju; zasebno onemogućiti učitavanje karte u detaljima. |
| NF-005 | UC-004, UC-007, UC-008, UC-010. | Simulirati neuspjeh spremanja za svaku radnju i provjeriti izostanak lažne potvrde. |

## 2.7 Review of Requirements

Slučajeve uporabe potrebno je održavati usklađenima sa zahtjevima te povezati stvarne projektne testove kada budu izrađeni.

| Checkpoint | Feedback or finding | Resulting requirement or scope decision |
| --- | --- | --- |
| Prva formalna kontrolna točka | Povratne informacije još nisu dokumentirane. | nakon pregleda povezati stvarne zaključke i eventualne promjene u odjeljku 2.5. |
| Završna formalna kontrolna točka | Povratne informacije još nisu dokumentirane. | uskladiti zahtjeve s dogovorenim opsegom i dokazima provjere. |

Termine kontrolnih točaka treba provjeriti prema uputama kolegija. Slučajeve uporabe treba uskladiti s razradom u 2.5, posebno UC-013 koji još zahtijeva prijavu, te povezati stvarne projektne testove.
