# Endpoints de Rating - Ajustes Necessários

## URLs Atuais do Serviço Frontend

Com base no endpoint que você mostrou, ajustei o serviço para:

### ✅ **Funcionando** (confirmado que existe):
```
GET /ratings/package/{packageId} → Retorna List<RatingDTO>
```

### 🔄 **Precisam ser implementados no Backend**:

```typescript
// URLs que o frontend está usando:
GET    /ratings                     → List<RatingDetail> (todos os ratings)
GET    /ratings/{id}                → RatingDetail (rating específico)
POST   /ratings                     → SaveRatingResponse (criar rating)
PUT    /ratings/{id}                → SaveRatingResponse (atualizar rating)
DELETE /ratings/{id}                → void (deletar rating)
GET    /ratings/reservation/{reservationId} → RatingDetail (rating por reserva)
```

## Sugestões para o Backend

### 1. Controller completo para Ratings:

```java
@RestController
@RequestMapping("/ratings")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    // ✅ Já existe
    @GetMapping("/package/{packageId}")
    public ResponseEntity<List<RatingDTO>> listarAvaliacoesPorPacote(@PathVariable UUID packageId) {
        return ResponseEntity.ok(ratingService.findByTravelPackage(packageId));
    }

    // 🆕 Novos endpoints necessários:
    
    @GetMapping
    public ResponseEntity<List<RatingDTO>> listarTodosRatings() {
        return ResponseEntity.ok(ratingService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RatingDTO> buscarRatingPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(ratingService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RatingDTO> criarRating(@RequestBody SaveRatingRequest request) {
        RatingDTO rating = ratingService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(rating);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RatingDTO> atualizarRating(@PathVariable UUID id, @RequestBody SaveRatingRequest request) {
        RatingDTO rating = ratingService.update(id, request);
        return ResponseEntity.ok(rating);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarRating(@PathVariable UUID id) {
        ratingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<RatingDTO> buscarRatingPorReserva(@PathVariable UUID reservationId) {
        return ResponseEntity.ok(ratingService.findByReservation(reservationId));
    }
}
```

### 2. DTOs necessários:

```java
// SaveRatingRequest.java
public class SaveRatingRequest {
    private Integer rate;        // 1-5
    private String comment;      // comentário
    private UUID reservationId;  // ID da reserva
    
    // getters e setters
}

// RatingDTO.java (ajustar o existente se necessário)
public class RatingDTO {
    private UUID id;
    private Integer rate;
    private String comment;
    private UUID reservationId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // getters e setters
}
```

### 3. Validações de Negócio:

```java
// No RatingService:
public RatingDTO save(SaveRatingRequest request) {
    // Validar se reserva existe
    // Validar se reserva está COMPLETED
    // Validar se usuário é dono da reserva
    // Validar se não existe rating para essa reserva
    // Validar rate (1-5) e comment (não vazio)
    
    // Salvar rating
}
```

## Configuração Temporária

Por enquanto, o frontend está configurado para:
- Buscar **todos** os ratings e filtrar os melhores no frontend (carrossel)
- Funcionar com listas simples em vez de paginação
- Mostrar erro gracioso se endpoints não existirem

## Próximos Passos

1. **Implementar os endpoints no backend**
2. **Testar com dados reais**
3. **Ajustar validações conforme regras de negócio**
4. **Implementar paginação se necessário**

## Endpoints Opcionais (melhorias futuras):

```java
// Para otimizar performance:
@GetMapping("/top")
public ResponseEntity<List<RatingDTO>> listarMelhoresRatings(@RequestParam(defaultValue = "6") int limit) {
    return ResponseEntity.ok(ratingService.findTopRatings(limit));
}

@GetMapping("/package/{packageId}/average")
public ResponseEntity<Double> obterMediaRatingsPacote(@PathVariable UUID packageId) {
    return ResponseEntity.ok(ratingService.getAverageRatingForPackage(packageId));
}
```
