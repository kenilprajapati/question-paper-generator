import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 3,
  },
  question: {
    fontSize: 10,
    marginBottom: 10,
  },
  questionText: {
    fontWeight: 'bold',
  },
  option: {
    marginLeft: 20,
    marginTop: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    fontStyle: 'italic',
    borderTopWidth: 1,
    borderTopColor: '#000',
    paddingTop: 10,
  },
});

const QuestionPaperPDF = ({ data, subject, term }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>UNIVERSITY OF TECHNOLOGY</Text>
        <Text style={styles.subtitle}>FACULTY OF COMPUTER APPLICATIONS</Text>
        <Text style={styles.subtitle}>{term.toUpperCase()} EXAMINATION : 2026</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text>Subject: {subject}</Text>
        <Text>Total Marks: {data.totalMarks || 70}</Text>
      </View>

      <View style={styles.sectionTitle}>
        <Text>ALL QUESTIONS ARE COMPULSORY</Text>
      </View>

      {data.selectedQuestions?.map((q, idx) => (
        <View key={q._id || idx} style={styles.question} wrap={false}>
          <Text style={styles.questionText}>
            Q{idx + 1}. {q.text} ({q.marks} Marks)
          </Text>
          {q.type === 'MCQ' && q.options && (
            <View style={styles.option}>
              <Text>(A) {q.options.a}</Text>
              <Text>(B) {q.options.b}</Text>
              <Text>(C) {q.options.c}</Text>
              <Text>(D) {q.options.d}</Text>
            </View>
          )}
        </View>
      ))}

      <View style={styles.footer}>
        <Text>*** End of Question Paper ***</Text>
      </View>
    </Page>
  </Document>
);

export default QuestionPaperPDF;
