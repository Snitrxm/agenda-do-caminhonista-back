export class DateUtils {
  static getStartOfWeek(date: Date) {
    const diaSemana = date.getDay(); // 0 para domingo, 1 para segunda-feira, etc.
    const primeiroDia = new Date(date); // Cria uma cópia da data fornecida

    // Se não for segunda-feira (dia 1), ajuste para o último domingo (dia 0)
    if (diaSemana !== 1) {
      primeiroDia.setDate(
        date.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1),
      );
    }

    // Retorna o primeiro dia da semana
    return primeiroDia;
  }

  static getEndOfWeek(date: Date) {
    const ultimoDia = DateUtils.getStartOfWeek(date); // Obtém o primeiro dia da semana
    ultimoDia.setDate(ultimoDia.getDate() + 6); // Adiciona 6 dias para obter o último dia da semana

    // Retorna o último dia da semana
    return ultimoDia;
  }
}
