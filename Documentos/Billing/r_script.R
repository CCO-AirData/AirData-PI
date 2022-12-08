costs <- costs[-1, ]

library(ggplot2)

mes <- c(09, 10, 11)
valor <- costs$Custo.total....

df <- data.frame(mes, valor)

linearModel <- lm(valor~mes, data = df)
predicao <- predict(linearModel, data.frame(mes = c(12)), interval = 'confidence')

print(predicao)
 
mes <- c(09, 10, 11, 12)
valor <- c(costs$Custo.total...., 4.230)

df <- data.frame(mes, valor)
meses <- c("setembro", "outubro", "novembro", "dezembro")

bar <- barplot(df$valor, main = 'Previsão de gasto com a EC2',
        xlab = "Meses", ylab = "Custo",
        names.arg = meses, col = c('#277df6', '#5d9bf8', '#78aaf9', '#93b9f9'))

text(bar, 1.5, paste(c(1.22, 2.62, 3.13, 4.23), sep=""), cex=1.5)

p <- ggplot(df, aes(mes, valor)) +
  geom_point(aes(colour = factor(meses)), size = 5) +
  geom_smooth(se = TRUE, method = "lm")

p